/**
 * PharmReady-AlmaghwryBy-Fadel - Updated Backend Database Script
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
  // CORS Headers
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    var params = {};
    
    // Parse request parameters
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      params = e.parameter;
    } else if (e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        // Fallback for form URL encoded
        var parts = e.postData.contents.split('&');
        for (var i = 0; i < parts.length; i++) {
          var pair = parts[i].split('=');
          params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
      }
    }
    
    var action = params.action;
    var responseData = { success: false, message: "Invalid action: " + action };
    
    // Connect to Google Sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Initialize Sheets if they don't exist
    initSheets(sheet);
    
    // Action router
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
      responseData = adminLogin(params);
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

// Initialize sheets if they do not exist
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
    }
  ];
  
  sheetsNeeded.forEach(function(s) {
    var sh = spreadsheet.getSheetByName(s.name);
    if (!sh) {
      sh = spreadsheet.insertSheet(s.name);
      sh.appendRow(s.headers);
      sh.setFrozenRows(1);
    }
  });
}

// Helper to convert sheet rows into array of objects
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
    row.rowNum = i + 1; // 1-indexed row number in sheet
    rows.push(row);
  }
  return rows;
}

// 1. Register a Trainee
function registerTrainee(sheet, params) {
  var sh = sheet.getSheetByName("Trainees");
  var trainees = getSheetData(sheet, "Trainees");
  
  // Check if phone number already exists
  var phone = String(params.phone).trim();
  for (var i = 0; i < trainees.length; i++) {
    if (String(trainees[i].Phone).trim() === phone) {
      return { success: false, message: "رقم الهاتف هذا مسجل بالفعل في النظام!" };
    }
  }
  
  // Verify safety question
  var securityAnswer = String(params.securityAnswer).trim();
  if (securityAnswer !== "1") {
    return { success: false, message: "إجابة سؤال الأمان خاطئة. يرجى التأكد من الإجابة الصحيحة." };
  }
  
  // Default current level is chosen level (or passengers if not provided)
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
    "pending", // Status
    "",        // Generated Email
    "",        // Generated Password
    "",        // Reject Reason
    targetLevel // CurrentLevel
  ]);
  
  return { success: true, message: "تم تسجيل البيانات بنجاح في نظام المراجعة." };
}

// 2. Check Status by Phone
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

// 3. Login Trainee
function loginTrainee(sheet, params) {
  var trainees = getSheetData(sheet, "Trainees");
  var email = String(params.email).trim().toLowerCase();
  var password = String(params.password).trim();
  
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (t.Status === "accepted" && String(t.Email).trim().toLowerCase() === email && String(t.Password).trim() === password) {
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
  return { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو أن حسابك لم يتم قبوله بعد." };
}

// 4. Change Password
function changePassword(sheet, params) {
  var sh = sheet.getSheetByName("Trainees");
  var trainees = getSheetData(sheet, "Trainees");
  var email = String(params.email).trim().toLowerCase();
  var oldPassword = String(params.oldPassword).trim();
  var newPassword = String(params.newPassword).trim();
  
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (String(t.Email).trim().toLowerCase() === email && String(t.Password).trim() === oldPassword) {
      sh.getRange(t.rowNum, 13).setValue(newPassword); // Column 13 is Password
      
      // Log notification
      var notifSh = sheet.getSheetByName("Notifications");
      notifSh.appendRow([
        new Date(),
        t.Name,
        t.Email,
        newPassword
      ]);
      
      return { success: true, message: "تم تغيير كلمة المرور بنجاح." };
    }
  }
  return { success: false, message: "كلمة المرور الحالية غير صحيحة." };
}

// 5. Get Trainee Videos, Watched Progress and Completed Levels
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
  
  // Filter videos that belong to their current level
  var filteredVideos = [];
  for (var v = 0; v < videos.length; v++) {
    if (String(videos[v].Level || "Passengers").trim() === currentLevel) {
      filteredVideos.push(videos[v]);
    }
  }
  
  // Get watched progress for this student
  var progress = getSheetData(sheet, "Progress");
  var watchedIds = [];
  for (var j = 0; j < progress.length; j++) {
    if (String(progress[j].Email).trim().toLowerCase() === email) {
      watchedIds.push(String(progress[j].VideoId).trim());
    }
  }
  
  // Get approved promotions (to know completed levels and certificates)
  var promotions = getSheetData(sheet, "Promotions");
  var completedLevels = [];
  for (var p = 0; p < promotions.length; p++) {
    if (String(promotions[p].Email).trim().toLowerCase() === email && promotions[p].Status === "approved") {
      completedLevels.push(String(promotions[p].FromLevel));
    }
  }
  
  // Check if there is a pending promotion request
  var pendingPromotion = false;
  for (var p = 0; p < promotions.length; p++) {
    if (String(promotions[p].Email).trim().toLowerCase() === email && promotions[p].Status === "pending") {
      pendingPromotion = true;
      break;
    }
  }
  
  return {
    success: true,
    videos: filteredVideos,
    watched: watchedIds,
    currentLevel: currentLevel,
    completedLevels: completedLevels,
    pendingPromotion: pendingPromotion
  };
}

// 6. Update Video Progress
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
  
  var alreadyExists = false;
  for (var j = 0; j < progress.length; j++) {
    if (String(progress[j].Email).trim().toLowerCase() === email && String(progress[j].VideoId).trim() === videoId) {
      alreadyExists = true;
      break;
    }
  }
  
  if (!alreadyExists) {
    progressSh.appendRow([
      new Date(),
      email,
      videoId
    ]);
  }
  
  return { success: true, message: "تم تسجيل إتمام المشاهدة بنجاح." };
}

// 7. Submit level promotion request
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
  
  // Check if there is already a pending or approved request for this transition
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
  
  promotionsSh.appendRow([
    new Date(),
    email,
    fromLevel,
    toLevel,
    "pending"
  ]);
  
  return { success: true, message: "تم إرسال طلب الترقية وإصدار الشهادة بنجاح للمدير." };
}

// 8. Admin Login
function adminLogin(params) {
  var password = String(params.password).trim();
  if (password === "madmody") {
    return { success: true, message: "تم تسجيل الدخول بنجاح كمدير." };
  }
  return { success: false, message: "رمز المرور غير صحيح." };
}

// 9. Admin Get Trainees
function adminGetTrainees(sheet, params) {
  if (String(params.adminPassword).trim() !== "madmody") {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  
  var trainees = getSheetData(sheet, "Trainees");
  return { success: true, trainees: trainees };
}

// 10. Admin Action (Accept/Reject student)
function adminAction(sheet, params) {
  if (String(params.adminPassword).trim() !== "madmody") {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  
  var sh = sheet.getSheetByName("Trainees");
  var trainees = getSheetData(sheet, "Trainees");
  var phone = String(params.phone).trim();
  var actionState = params.actionState; // "accept" or "reject"
  
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (String(t.Phone).trim() === phone) {
      if (actionState === "accept") {
        sh.getRange(t.rowNum, 11).setValue("accepted"); // Status
        sh.getRange(t.rowNum, 12).setValue(params.generatedEmail); // Email
        sh.getRange(t.rowNum, 13).setValue(params.generatedPassword); // Password
        sh.getRange(t.rowNum, 14).setValue(""); // RejectReason
        sh.getRange(t.rowNum, 15).setValue(params.currentLevel || t.CurrentLevel || "Passengers"); // CurrentLevel
      } else {
        sh.getRange(t.rowNum, 11).setValue("rejected");
        sh.getRange(t.rowNum, 14).setValue(params.rejectReason);
      }
      return { success: true, message: "تم حفظ الإجراء بنجاح." };
    }
  }
  return { success: false, message: "لم يتم العثور على المتدرب." };
}

// 11. Admin Get Videos
function adminGetVideos(sheet, params) {
  if (String(params.adminPassword).trim() !== "madmody") {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  var videos = getSheetData(sheet, "Videos");
  return { success: true, videos: videos };
}

// 12. Admin Add Video
function adminAddVideo(sheet, params) {
  if (String(params.adminPassword).trim() !== "madmody") {
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
  
  sh.appendRow([
    new Date(),
    videoId,
    title,
    url,
    level
  ]);
  
  return { success: true, message: "تم إضافة الفيديو للمستوى بنجاح." };
}

function extractYouTubeId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// 13. Admin Delete Video
function adminDeleteVideo(sheet, params) {
  if (String(params.adminPassword).trim() !== "madmody") {
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

// 14. Admin Get Notifications
function adminGetNotifications(sheet, params) {
  if (String(params.adminPassword).trim() !== "madmody") {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  var notifications = getSheetData(sheet, "Notifications");
  return { success: true, notifications: notifications };
}

// 15. Admin Get Promotion & Certificate Requests
function adminGetPromotions(sheet, params) {
  if (String(params.adminPassword).trim() !== "madmody") {
    return { success: false, message: "غير مصرح بالدخول." };
  }
  
  var promotions = getSheetData(sheet, "Promotions");
  var trainees = getSheetData(sheet, "Trainees");
  
  // Attach student name to the promotion objects for rendering convenience
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

// 16. Admin Approve Level Promotion & Issue Certificate
function adminApprovePromotion(sheet, params) {
  if (String(params.adminPassword).trim() !== "madmody") {
    return { success: false, message: "غير مصرح بالعملية." };
  }
  
  var email = String(params.email).trim().toLowerCase();
  var fromLevel = String(params.fromLevel).trim();
  var toLevel = String(params.toLevel).trim();
  
  var traineesSh = sheet.getSheetByName("Trainees");
  var promotionsSh = sheet.getSheetByName("Promotions");
  
  var trainees = getSheetData(sheet, "Trainees");
  var promotions = getSheetData(sheet, "Promotions");
  
  // 1. Update Trainee CurrentLevel
  var traineeUpdated = false;
  for (var i = 0; i < trainees.length; i++) {
    var t = trainees[i];
    if (String(t.Email).trim().toLowerCase() === email) {
      traineesSh.getRange(t.rowNum, 15).setValue(toLevel); // Column 15: CurrentLevel
      traineeUpdated = true;
      break;
    }
  }
  
  if (!traineeUpdated) {
    return { success: false, message: "لم يتم العثور على المتدرب لتعديل مستواه." };
  }
  
  // 2. Update Promotion Status to approved
  for (var j = 0; j < promotions.length; j++) {
    var p = promotions[j];
    if (String(p.Email).trim().toLowerCase() === email && String(p.FromLevel).trim() === fromLevel && String(p.ToLevel).trim() === toLevel) {
      promotionsSh.getRange(p.rowNum, 5).setValue("approved"); // Column 5: Status
      return { success: true, message: "تمت الموافقة على الترقية وإصدار الشهادة بنجاح." };
    }
  }
  
  return { success: true, message: "تم ترقية مستوى المتدرب بنجاح (لم يتم العثور على سجل الترقية المعلق ولكن تم الترقية يدوياً)." };
}
