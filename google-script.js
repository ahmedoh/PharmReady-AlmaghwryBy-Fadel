/**
 * PharmReady-AlmaghwryBy-Fadel - Cloud Database Script
 * Copy this code into Google Apps Script (Extensions -> Apps Script in your Google Sheet)
 * Then deploy it as a Web App: 
 * - Execute as: Me
 * - Who has access: Anyone
 */

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    var params = {};
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      params = e.parameter;
    } else if (e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        var parts = e.postData.contents.split('&');
        for (var i = 0; i < parts.length; i++) {
          var pair = parts[i].split('=');
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
      }
    }
    
    var action = params.action;
    var responseData = { success: false, message: "Invalid action: " + action };
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    initSheets(sheet);
    
    if (action === "register") {
      responseData = registerTrainee(sheet, params);
    } else if (action === "checkStatus") {
      responseData = checkStatus(sheet, params);
    } else if (action === "login") {
      responseData = loginTrainee(sheet, params);
    } else if (action === "changePassword") {
      responseData = changePassword(sheet, params);
    } else if (action === "getTraineeVideos") {
      responseData = getTraineeVideos(sheet, params);
    } else if (action === "updateProgress") {
      responseData = updateProgress(sheet, params);
    } else if (action === "submitPromotionRequest") {
      responseData = submitPromotionRequest(sheet, params);
    } else if (action === "adminLogin") {
      responseData = adminLogin(sheet, params);
    } else if (action === "adminGetTrainees") {
      responseData = adminGetTrainees(sheet, params);
    } else if (action === "adminAction") {
      responseData = adminAction(sheet, params);
    } else if (action === "adminGetVideos") {
      responseData = adminGetVideos(sheet, params);
    } else if (action === "adminAddVideo") {
      responseData = adminAddVideo(sheet, params);
    } else if (action === "adminDeleteVideo") {
      responseData = adminDeleteVideo(sheet, params);
    } else if (action === "adminGetNotifications") {
      responseData = adminGetNotifications(sheet, params);
    } else if (action === "adminGetPromotions") {
      responseData = adminGetPromotions(sheet, params);
    } else if (action === "adminApprovePromotion") {
      responseData = adminApprovePromotion(sheet, params);
    } else if (action === "adminGetAdmins") {
      responseData = adminGetAdmins(sheet, params);
    } else if (action === "adminAddAdmin") {
      responseData = adminAddAdmin(sheet, params);
    } else if (action === "adminGetQuestions") {
      responseData = adminGetQuestions(sheet, params);
    } else if (action === "adminAddQuestion") {
      responseData = adminAddQuestion(sheet, params);
    } else if (action === "adminDeleteQuestion") {
      responseData = adminDeleteQuestion(sheet, params);
    } else if (action === "adminEditTrainee") {
      responseData = adminEditTrainee(sheet, params);
    } else if (action === "adminToggleBlockTrainee") {
      responseData = adminToggleBlockTrainee(sheet, params);
    } else if (action === "submitTraineeReport") {
      responseData = submitTraineeReport(sheet, params);
    } else if (action === "getTraineeReports") {
      responseData = getTraineeReports(sheet, params);
    } else if (action === "adminGetReports") {
      responseData = adminGetReports(sheet, params);
    } else if (action === "adminUpdateReportStatus") {
      responseData = adminUpdateReportStatus(sheet, params);
    } else if (action === "adminGetProgress") {
      responseData = adminGetProgress(sheet, params);
    }
    
    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Server Error: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function initSheets(spreadsheet) {
  var sheetsNeeded = [
    { 
      name: "Trainees", 
      headers: ["Timestamp", "Name", "Age", "BirthYear", "Phone", "WhatsApp", "College", "Squad", "University", "TrainingBranch", "Status", "Email", "Password", "RejectReason", "CurrentLevel"] 
    },
    { 
      name: "Videos", 
      headers: ["Timestamp", "VideoId", "Title", "Url", "Level"] 
    },
    { 
      name: "Progress", 
      headers: ["Timestamp", "Email", "VideoId"] 
    },
    { 
      name: "Promotions", 
      headers: ["Timestamp", "Email", "FromLevel", "ToLevel", "Status"] 
    },
    { 
      name: "Notifications", 
      headers: ["Timestamp", "Name", "Email", "NewPassword"] 
    },
    {
      name: "Admins",
      headers: ["Timestamp", "Username", "Password", "Role"]
    },
    {
      name: "Questions",
      headers: ["Timestamp", "Level", "QuestionAr", "QuestionEn", "Option1Ar", "Option1En", "Option2Ar", "Option2En", "Option3Ar", "Option3En", "CorrectIndex"]
    },
    {
      name: "Reports",
      headers: ["Timestamp", "Email", "Name", "Level", "Title", "Content", "Attachment", "AttachmentName", "Status", "AdminComment"]
    }
  ];
  
  sheetsNeeded.forEach(function(s) {
    var sh = spreadsheet.getSheetByName(s.name);
    if (!sh) {
      sh = spreadsheet.insertSheet(s.name);
      sh.appendRow(s.headers);
      sh.setFrozenRows(1);
      
      // Seed default questions if Questions sheet is new
      if (s.name === "Questions") {
        seedDefaultQuestions(sh);
      }
      
      // Seed default admin if Admins sheet is new
      if (s.name === "Admins") {
        sh.appendRow([new Date(), "madmody", "madmody", "Owner"]);
      }
    }
  });
}

function seedDefaultQuestions(sh) {
  var defaultQuestions = [
    // Passengers (Level 0)
    ["Passengers", "ما هو الهدف الأساسي من آداب وأخلاقيات مهنة الصيدلة؟", "What is the primary goal of pharmacy professional ethics?", "زيادة أرباح الصيدلية المادية بأي طريقة كانت.", "Increasing pharmacy profits by any means.", "تقديم مصلحة ورعاية المريض بأعلى معايير الأمان والأخلاق.", "Prioritizing patient care and safety with the highest ethical standards.", "التنافس غير الشريف مع الصيدليات المجاورة.", "Unfair competition with neighboring pharmacies.", "1"],
    ["Passengers", "ما هي درجة الحرارة المناسبة لتخزين الأنسولين واللقاحات الحيوية؟", "What is the appropriate storage temperature for insulin and vaccines?", "في درجة حرارة الغرفة العادية (25 مئوية).", "At normal room temperature (25°C).", "تحت الصفر المطلق في الفريزر.", "Below zero in the freezer.", "في الثلاجة بين درجة حرارة 2 إلى 8 درجات مئوية.", "In the refrigerator between 2°C and 8°C.", "2"],
    ["Passengers", "أين تقع جميع فروع صيدليات آل مغاوري؟", "Where are all El-Maghawry Pharmacies branches located?", "في مدينة دمياط القديمة", "In Old Damietta city", "في مدينة دمياط الجديدة فقط", "In New Damietta city only", "في القاهرة والإسكندرية", "In Cairo and Alexandria", "1"],
    
    // Starters (Level 1)
    ["Starters", "ما هو البروتوكول الأولي المعتمد للتعامل مع حرق من الدرجة الأولى؟", "What is the primary protocol to handle a first-degree burn?", "وضع معجون الأسنان أو الزبدة مباشرة فوق موضع الحرق.", "Applying toothpaste or butter directly onto the burn site.", "وضع ماء جاري فاتر لمدة 10-15 دقيقة ثم استخدام مرهم حروق.", "Placing under cool running water for 10-15 minutes, then using a burn ointment.", "تغطية الحرق بلاصق طبي غير معقم فوراً.", "Covering the burn immediately with a non-sterile adhesive tape.", "1"],
    ["Starters", "أي المجموعات الدوائية التالية تستخدم لخفض الحرارة وتسكين الآلام بأمان للأطفال؟", "Which of the following drug classes is used to safely reduce fever and relieve pain in children?", "مادة الباراسيتامول بالجرعة المحسوبة حسب وزن الطفل.", "Paracetamol in a calculated dose based on the child's weight.", "مادة الأسبرين بجرعات كبيرة لضمان سرعة المفعول.", "Aspirin in high doses to guarantee quick action.", "مضادات الالتهاب غير الستيرويدية دون استشارة طبية.", "Non-steroidal anti-inflammatory drugs (NSAIDs) without medical consultation.", "0"],
    
    // Movers (Level 2)
    ["Movers", "ما هو التحذير الحرج للغاية الذي يجب توجيهه للمريض عند صرف مضاد حيوي من عائلة (Fluoroquinolones)؟", "What is the highly critical warning when dispensing a Fluoroquinolone antibiotic?", "عدم تناوله مع الحليب أو المكملات المحتوية على الكالسيوم أو الحديد لأنه يقلل امتصاصه.", "Do not take with milk or calcium/iron supplements as it reduces absorption.", "ضرورة تناوله مع عصائر الحمضيات المركزة لزيادة قوته.", "Must be taken with concentrated citrus juices to increase strength.", "تناوله مع القهوة والشاي فقط لتجنب الدوخة.", "Take it with coffee and tea only to avoid dizziness.", "0"],
    
    // Flyers (Level 3)
    ["Flyers", "عند تحضير تركيبة صيدلانية تجميلية تحتوي على فيتامين C، كيف يجب حماية المستحضر من الأكسدة؟", "When preparing a formulation containing Vitamin C, how should you protect it from oxidation?", "تعبئته في عبوات زجاجية معتمة أو داكنة اللون، وحفظه في مكان بارد وبعيد عن الضوء والهواء.", "Packaging it in opaque or dark amber glass bottles, storing it in a cool place away from light and air.", "إضافة كميات كبيرة من الكحول الطبي لتعقيم المحلول.", "Adding large amounts of rubbing alcohol to sterilize the solution.", "تركه معرضاً للهواء المباشر والضوء لتنشيط الجزيئات.", "Leaving it exposed to direct air and light to activate vitamin molecules.", "0"],
    
    // Beast (Level 4)
    ["Beast", "ما هي المعادلة الذهبية المتبعة لإدارة طلبيات الأدوية والنواقص في الصيدلية لضمان عدم ركود البضائع؟", "What is the golden equation for managing drug orders and shortages in the pharmacy to avoid stagnant stock?", "شراء كميات ضخمة من جميع الأصناف دون النظر لمعدل الاستهلاك اليومي.", "Buying huge quantities of all items regardless of daily consumption rate.", "حساب معدل السحب اليومي والشهري لكل صنف، والطلب بناءً على حد الأمان والطلب الأدنى (Min/Max Level).", "Calculating daily/monthly consumption for each item and ordering based on Min/Max safety levels.", "إيقاف الطلبيات تماماً والاعتماد فقط على التبادل.", "Stopping orders completely and relying solely on stock swaps.", "1"]
  ];
  
  defaultQuestions.forEach(function(q) {
    sh.appendRow([new Date()].concat(q));
  });
}

function getSheetData(sheet, sheetName) {
  var sh = sheet.getSheetByName(sheetName);
  if (!sh) return [];
  var data = sh.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  var headers = data[0];
  var rows = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    row.rowNum = i + 1;
    rows.push(row);
  }
  return rows;
}

function registerTrainee(sheet, params) {
  var sh = sheet.getSheetByName("Trainees");
  var trainees = getSheetData(sheet, "Trainees");
  var phone = String(params.phone).trim();
  
  for (var i = 0; i < trainees.length; i++) {
    if (String(trainees[i].Phone).trim() === phone) {
      return { success: false, message: "رقم الهاتف هذا مسجل بالفعل في النظام!" };
    }
  }
  
  var securityAnswer = String(params.securityAnswer).trim();
  if (securityAnswer !== "1") {
    return { success: false, message: "إجابة سؤال الأمان خاطئة. يرجى التأكد من الإجابة الصحيحة." };
  }
  
  var targetLevel = params.targetLevel || "Passengers";
  
  sh.appendRow([
    new Date(),
    params.name,
    params.age,
    params.birthYear,
    phone,
    params.whatsApp || "لا يوجد",
    params.college,
    params.squad,
    params.university,
    params.trainingBranch,
    "pending",
    "",
    "",
    "",
    targetLevel
  ]);
  
  return { success: true, message: "تم تسجيل البيانات بنجاح في نظام المراجعة." };
}

function checkStatus(sheet, params) {
  var trainees = getSheetData(sheet, "Trainees");
  var phone = String(params.phone).trim();
  
  for (var i = 0; i < trainees.length; i++) {
    if (String(trainees[i].Phone).trim() === phone) {
      var t = trainees[i];
      return {
        success: true,
        status: t.Status,
        email: t.Email,
        password: t.Password,
        rejectReason: t.RejectReason,
        name: t.Name,
        currentLevel: t.CurrentLevel
      };
    }
  }
  return { success: false, message: "رقم الهاتف هذا غير مسجل في النظام." };
}

function loginTrainee(sheet, params) {
  var trainees = getSheetData(sheet, "Trainees");
  var email = String(params.email).trim().toLowerCase();
  var password = String(params.password).trim();
  
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (String(t.Email).trim().toLowerCase() === email && String(t.Password).trim() === password) {
      if (t.Status === "blocked") {
        return { success: false, message: "تم حظر هذا الحساب من قبل الإدارة!" };
      }
      if (t.Status === "accepted") {
        return {
          success: true,
          trainee: {
            name: t.Name,
            email: t.Email,
            phone: t.Phone,
            branch: t.TrainingBranch,
            level: t.CurrentLevel || "Passengers"
          }
        };
      }
    }
  }
  return { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو أن حسابك لم يتم قبوله بعد." };
}

function changePassword(sheet, params) {
  var sh = sheet.getSheetByName("Trainees");
  var trainees = getSheetData(sheet, "Trainees");
  var email = String(params.email).trim().toLowerCase();
  var oldPassword = String(params.oldPassword).trim();
  var newPassword = String(params.newPassword).trim();
  
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (String(t.Email).trim().toLowerCase() === email && String(t.Password).trim() === oldPassword) {
      sh.getRange(t.rowNum, 13).setValue(newPassword);
      
      var notifSh = sheet.getSheetByName("Notifications");
      notifSh.appendRow([new Date(), t.Name, t.Email, newPassword]);
      
      return { success: true, message: "تم تغيير كلمة المرور بنجاح." };
    }
  }
  return { success: false, message: "كلمة المرور الحالية غير صحيحة." };
}

function getTraineeVideos(sheet, params) {
  var trainees = getSheetData(sheet, "Trainees");
  var email = String(params.email).trim().toLowerCase();
  var password = String(params.password).trim();
  
  var activeTrainee = null;
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (t.Status === "accepted" && String(t.Email).trim().toLowerCase() === email && String(t.Password).trim() === password) {
      activeTrainee = t;
      break;
    }
  }
  
  if (!activeTrainee) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  
  var currentLevel = activeTrainee.CurrentLevel || "Passengers";
  var videos = getSheetData(sheet, "Videos");
  
  var filteredVideos = [];
  for (var v = 0; v < videos.length; v++) {
    if (String(videos[v].Level || "Passengers").trim() === currentLevel) {
      filteredVideos.push(videos[v]);
    }
  }
  
  var progress = getSheetData(sheet, "Progress");
  var watchedIds = [];
  for (var j = 0; j < progress.length; j++) {
    if (String(progress[j].Email).trim().toLowerCase() === email) {
      watchedIds.push(String(progress[j].VideoId).trim());
    }
  }
  
  var promotions = getSheetData(sheet, "Promotions");
  var completedLevels = [];
  for (var p = 0; p < promotions.length; p++) {
    if (String(promotions[p].Email).trim().toLowerCase() === email && promotions[p].Status === "approved") {
      completedLevels.push(String(promotions[p].FromLevel));
    }
  }
  
  var pendingPromotion = false;
  for (var p = 0; p < promotions.length; p++) {
    if (String(promotions[p].Email).trim().toLowerCase() === email && promotions[p].Status === "pending") {
      pendingPromotion = true;
      break;
    }
  }
  
  // Return exam questions loaded dynamically from sheet for their level
  var allQuestions = getSheetData(sheet, "Questions");
  var levelQuestions = [];
  for (var q = 0; q < allQuestions.length; q++) {
    if (String(allQuestions[q].Level).trim() === currentLevel) {
      levelQuestions.push({
        q: allQuestions[q].QuestionAr,
        q_en: allQuestions[q].QuestionEn,
        options: [allQuestions[q].Option1Ar, allAllOption(allQuestions[q].Option2Ar), allAllOption(allQuestions[q].Option3Ar)].filter(Boolean),
        options_en: [allQuestions[q].Option1En, allAllOption(allQuestions[q].Option2En), allAllOption(allQuestions[q].Option3En)].filter(Boolean),
        correct: parseInt(allQuestions[q].CorrectIndex) || 0
      });
    }
  }
  
  // Helper to filter empty options
  function allAllOption(val) {
    return val && String(val).trim() ? String(val).trim() : "";
  }
  
  // Re-format levelQuestions slightly to match frontend expected structure
  var cleanQuestions = levelQuestions.map(function(item) {
    return {
      q: item.q,
      q_en: item.q_en,
      options: item.options.filter(function(o) { return o !== ""; }),
      options_en: item.options_en.filter(function(o) { return o !== ""; }),
      correct: item.correct
    };
  });
  
  return {
    success: true,
    videos: filteredVideos,
    watched: watchedIds,
    currentLevel: currentLevel,
    completedLevels: completedLevels,
    pendingPromotion: pendingPromotion,
    questions: cleanQuestions
  };
}

function updateProgress(sheet, params) {
  var trainees = getSheetData(sheet, "Trainees");
  var email = String(params.email).trim().toLowerCase();
  var password = String(params.password).trim();
  var videoId = String(params.videoId).trim();
  
  var authorized = false;
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (t.Status === "accepted" && String(t.Email).trim().toLowerCase() === email && String(t.Password).trim() === password) {
      authorized = true;
      break;
    }
  }
  
  if (!authorized) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  
  var progressSh = sheet.getSheetByName("Progress");
  var progress = getSheetData(sheet, "Progress");
  var alreadyWatched = false;
  for (var k = 0; k < progress.length; k++) {
    if (String(progress[k].Email).trim().toLowerCase() === email && String(progress[k].VideoId).trim() === videoId) {
      alreadyWatched = true;
      break;
    }
  }
  
  if (!alreadyWatched) {
    progressSh.appendRow([new Date(), email, videoId]);
  }
  
  return { success: true, message: "تم تسجيل إتمام المشاهدة بنجاح." };
}

function submitPromotionRequest(sheet, params) {
  var trainees = getSheetData(sheet, "Trainees");
  var email = String(params.email).trim().toLowerCase();
  var password = String(params.password).trim();
  var fromLevel = String(params.fromLevel).trim();
  var toLevel = String(params.toLevel).trim();
  
  var authorized = false;
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (t.Status === "accepted" && String(t.Email).trim().toLowerCase() === email && String(t.Password).trim() === password) {
      authorized = true;
      break;
    }
  }
  
  if (!authorized) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  
  var promotionsSh = sheet.getSheetByName("Promotions");
  var promotions = getSheetData(sheet, "Promotions");
  
  for (var j = 0; j < promotions.length; j++) {
    var p = promotions[j];
    if (String(p.Email).trim().toLowerCase() === email && String(p.FromLevel).trim() === fromLevel && String(p.ToLevel).trim() === toLevel) {
      if (p.Status === "pending") {
        return { success: false, message: "لديك طلب ترقية معلق بالفعل قيد المراجعة!" };
      } else if (p.Status === "approved") {
        return { success: false, message: "لقد تمت ترقيتك واجتيازك هذا المستوى بالفعل!" };
      }
    }
  }
  
  promotionsSh.appendRow([new Date(), email, fromLevel, toLevel, "pending"]);
  return { success: true, message: "تم إرسال طلب الترقية وإصدار الشهادة بنجاح للمدير." };
}

function verifyAdminCredential(sheet, adminPassword) {
  var pass = String(adminPassword).trim().toLowerCase();
  if (pass === "madmody") return true; // Creator/owner fallback
  
  var admins = getSheetData(sheet, "Admins");
  for (var i = 0; i < admins.length; i++) {
    if (String(admins[i].Password).trim().toLowerCase() === pass) {
      return true;
    }
  }
  return false;
}

function adminLogin(sheet, params) {
  var password = String(params.password).trim().toLowerCase();
  if (verifyAdminCredential(sheet, password)) {
    return { success: true, message: "تم تسجيل الدخول بنجاح كمدير." };
  }
  return { success: false, message: "رمز المرور غير صحيح." };
}

function adminGetTrainees(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  var trainees = getSheetData(sheet, "Trainees");
  return { success: true, trainees: trainees };
}

function adminAction(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  
  var sh = sheet.getSheetByName("Trainees");
  var trainees = getSheetData(sheet, "Trainees");
  var phone = String(params.phone).trim();
  var actionState = params.actionState;
  
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (String(t.Phone).trim() === phone) {
      if (actionState === "accept") {
        sh.getRange(t.rowNum, 11).setValue("accepted");
        sh.getRange(t.rowNum, 12).setValue(params.generatedEmail);
        sh.getRange(t.rowNum, 13).setValue(params.generatedPassword);
        sh.getRange(t.rowNum, 14).setValue("");
        sh.getRange(t.rowNum, 15).setValue(params.currentLevel || t.CurrentLevel || "Passengers");
      } else {
        sh.getRange(t.rowNum, 11).setValue("rejected");
        sh.getRange(t.rowNum, 14).setValue(params.rejectReason);
      }
      return { success: true, message: "تم حفظ الإجراء بنجاح." };
    }
  }
  return { success: false, message: "لم يتم العثور على المتدرب." };
}

function adminGetVideos(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  var videos = getSheetData(sheet, "Videos");
  return { success: true, videos: videos };
}

function adminAddVideo(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  
  var sh = sheet.getSheetByName("Videos");
  var url = String(params.url).trim();
  var title = String(params.title).trim();
  var level = String(params.level || "Passengers").trim();
  
  var videoId = extractYouTubeId(url);
  if (!videoId) {
    return { success: false, message: "رابط يوتيوب غير صالح!" };
  }
  
  sh.appendRow([new Date(), videoId, title, url, level]);
  return { success: true, message: "تم إضافة الفيديو للمستوى بنجاح." };
}

function extractYouTubeId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function adminDeleteVideo(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  
  var sh = sheet.getSheetByName("Videos");
  var videos = getSheetData(sheet, "Videos");
  var videoId = String(params.videoId).trim();
  
  for (var i = 0; i < videos.length; i++) {
    if (String(videos[i].VideoId).trim() === videoId) {
      sh.deleteRow(videos[i].rowNum);
      return { success: true, message: "تم حذف الفيديو بنجاح." };
    }
  }
  return { success: false, message: "لم يتم العثور على الفيديو." };
}

function adminGetNotifications(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  var notifications = getSheetData(sheet, "Notifications");
  return { success: true, notifications: notifications };
}

function adminGetPromotions(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  
  var promotions = getSheetData(sheet, "Promotions");
  var trainees = getSheetData(sheet, "Trainees");
  
  var enhancedPromotions = [];
  for (var i = 0; i < promotions.length; i++) {
    var p = promotions[i];
    var studentName = "متدرب مجهول";
    for (var t = 0; t < trainees.length; t++) {
      if (String(trainees[t].Email).trim().toLowerCase() === String(p.Email).trim().toLowerCase()) {
        studentName = trainees[t].Name;
        break;
      }
    }
    p.StudentName = studentName;
    enhancedPromotions.push(p);
  }
  
  return { success: true, promotions: enhancedPromotions };
}

function adminApprovePromotion(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  
  var email = String(params.email).trim().toLowerCase();
  var fromLevel = String(params.fromLevel).trim();
  var toLevel = String(params.toLevel).trim();
  
  var traineesSh = sheet.getSheetByName("Trainees");
  var promotionsSh = sheet.getSheetByName("Promotions");
  
  var trainees = getSheetData(sheet, "Trainees");
  var promotions = getSheetData(sheet, "Promotions");
  
  var traineeUpdated = false;
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (String(t.Email).trim().toLowerCase() === email) {
      traineesSh.getRange(t.rowNum, 15).setValue(toLevel);
      traineeUpdated = true;
      break;
    }
  }
  
  if (!traineeUpdated) {
    return { success: false, message: "لم يتم العثور على المتدرب لتعديل مستواه." };
  }
  
  for (var j = 0; j < promotions.length; j++) {
    var p = promotions[j];
    if (String(p.Email).trim().toLowerCase() === email && String(p.FromLevel).trim() === fromLevel && String(p.ToLevel).trim() === toLevel) {
      promotionsSh.getRange(p.rowNum, 5).setValue("approved");
      return { success: true, message: "تمت الموافقة على الترقية وإصدار الشهادة بنجاح." };
    }
  }
  
  return { success: true, message: "تم ترقية مستوى المتدرب بنجاح." };
}

function adminGetAdmins(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  var admins = getSheetData(sheet, "Admins");
  return { success: true, admins: admins };
}

function adminAddAdmin(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  var sh = sheet.getSheetByName("Admins");
  sh.appendRow([new Date(), params.username.trim(), params.password.trim(), params.role || "Admin"]);
  return { success: true, message: "تم إضافة المدير الجديد بنجاح." };
}

function adminGetQuestions(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  var questions = getSheetData(sheet, "Questions");
  return { success: true, questions: questions };
}

function adminAddQuestion(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  var sh = sheet.getSheetByName("Questions");
  sh.appendRow([
    new Date(),
    params.level,
    params.questionAr,
    params.questionEn,
    params.option1Ar,
    params.option1En,
    params.option2Ar,
    params.option2En,
    params.option3Ar,
    params.option3En,
    params.correctIndex
  ]);
  return { success: true, message: "تم إضافة السؤال بنجاح للمستوى." };
}

function adminDeleteQuestion(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  var sh = sheet.getSheetByName("Questions");
  var questions = getSheetData(sheet, "Questions");
  var rowNum = parseInt(params.rowNum);
  
  if (rowNum > 1 && rowNum <= (questions.length + 1)) {
    sh.deleteRow(rowNum);
    return { success: true, message: "تم حذف السؤال بنجاح." };
  }
  return { success: false, message: "رقم السطر غير صحيح." };
}

function adminEditTrainee(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  var sh = sheet.getSheetByName("Trainees");
  var trainees = getSheetData(sheet, "Trainees");
  var phone = String(params.phone).trim();
  
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (String(t.Phone).trim() === phone) {
      sh.getRange(t.rowNum, 2).setValue(params.name); // Name
      sh.getRange(t.rowNum, 12).setValue(params.email); // Email
      sh.getRange(t.rowNum, 15).setValue(params.level); // CurrentLevel
      sh.getRange(t.rowNum, 10).setValue(params.branch); // TrainingBranch
      return { success: true, message: "تم تعديل بيانات المتدرب بنجاح." };
    }
  }
  return { success: false, message: "لم يتم العثور على المتدرب." };
}

function adminToggleBlockTrainee(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  var sh = sheet.getSheetByName("Trainees");
  var trainees = getSheetData(sheet, "Trainees");
  var phone = String(params.phone).trim();
  var state = params.state; // "blocked" or "accepted"
  
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (String(t.Phone).trim() === phone) {
      sh.getRange(t.rowNum, 11).setValue(state); // Status
      return { success: true, message: state === "blocked" ? "تم حظر الحساب بنجاح." : "تم تنشيط الحساب بنجاح." };
    }
  }
  return { success: false, message: "لم يتم العثور على المتدرب." };
}

function submitTraineeReport(sheet, params) {
  var email = String(params.email).trim().toLowerCase();
  var password = String(params.password).trim();
  
  var trainees = getSheetData(sheet, "Trainees");
  var trainee = null;
  for (var i = 0; i < trainees.length; i++) {
    if (String(trainees[i].Email).trim().toLowerCase() === email && String(trainees[i].Password).trim() === password) {
      trainee = trainees[i];
      break;
    }
  }
  if (!trainee || trainee.Status !== "accepted") {
    return { success: false, message: "غير مصرح للمستخدم بتقديم التقارير." };
  }
  
  var reportsSh = sheet.getSheetByName("Reports");
  reportsSh.appendRow([
    new Date(),
    email,
    trainee.Name,
    trainee.CurrentLevel || "Passengers",
    params.title || "تقرير تدريب بدون عنوان",
    params.content || "",
    params.attachment || "",
    params.attachmentName || "",
    "pending",
    ""
  ]);
  return { success: true, message: "تم تقديم التقرير بنجاح للمراجع." };
}

function getTraineeReports(sheet, params) {
  var email = String(params.email).trim().toLowerCase();
  var password = String(params.password).trim();
  
  var trainees = getSheetData(sheet, "Trainees");
  var authorized = false;
  for (var i = 0; i < trainees.length; i++) {
    if (String(trainees[i].Email).trim().toLowerCase() === email && String(trainees[i].Password).trim() === password) {
      authorized = true;
      break;
    }
  }
  if (!authorized) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  
  var reports = getSheetData(sheet, "Reports");
  var filtered = [];
  for (var j = 0; j < reports.length; j++) {
    if (String(reports[j].Email).trim().toLowerCase() === email) {
      filtered.push(reports[j]);
    }
  }
  return { success: true, reports: filtered };
}

function adminGetReports(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  var reports = getSheetData(sheet, "Reports");
  return { success: true, reports: reports };
}

function adminUpdateReportStatus(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  var reportsSh = sheet.getSheetByName("Reports");
  var reports = getSheetData(sheet, "Reports");
  var email = String(params.email).trim().toLowerCase();
  var timestamp = String(params.timestamp).trim();
  var status = params.status; // "accepted", "needs_revision", "rejected"
  var comment = params.comment || "";
  
  for (var i = 0; i < reports.length; i++) {
    var r = reports[i];
    if (String(r.Email).trim().toLowerCase() === email && (String(r.Timestamp).indexOf(timestamp) !== -1 || String(new Date(r.Timestamp).getTime()) === String(new Date(timestamp).getTime()))) {
      reportsSh.getRange(r.rowNum, 9).setValue(status);
      reportsSh.getRange(r.rowNum, 10).setValue(comment);
      return { success: true, message: "تم تحديث حالة التقرير بنجاح." };
    }
  }
  
  if (params.rowNum) {
    var row = parseInt(params.rowNum);
    if (row > 1) {
      reportsSh.getRange(row, 9).setValue(status);
      reportsSh.getRange(row, 10).setValue(comment);
      return { success: true, message: "تم تحديث حالة التقرير بنجاح." };
    }
  }
  
  return { success: false, message: "لم يتم العثور على التقرير المطلوب." };
}

function adminGetProgress(sheet, params) {
  if (!verifyAdminCredential(sheet, params.adminPassword)) {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  var progress = getSheetData(sheet, "Progress");
  return { success: true, progress: progress };
}

