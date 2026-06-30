/**
 * PharmReady-AlmaghwryBy-Fadel - Configuration & API Wrapper (Updated)
 * 
 * Instructions:
 * 1. Deploy the code from google-script.js as a Google Apps Script Web App.
 * 2. Paste the Web App URL in the API_URL variable below.
 * 3. If API_URL is left empty or as placeholder, the system will run in "Demo Mode" 
 *    using browser LocalStorage, allowing you to test everything immediately without Google Sheets!
 */

const API_URL = "https://script.google.com/macros/s/AKfycbxBtQhRO0HYZM8udwsGxHOSB-_LkpPFknu0xTiU2TI8yhc4hVkb7K2RgcqF7QlRYtCf/exec";

// Check if we are running in Demo Mode
const isDemoMode = !API_URL || API_URL.includes("YOUR_GOOGLE_APPS_SCRIPT");

console.log(isDemoMode ? "🚀 Running in DEMO MODE (using LocalStorage)" : "🌐 Running in CLOUD MODE (connected to Google Sheets)");

/**
 * API Request Wrapper
 */
async function apiRequest(params) {
  if (isDemoMode) {
    return handleDemoRequest(params);
  }
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API Call Failed:", error);
    return {
      success: false,
      message: "فشل الاتصال بقاعدة البيانات السحابية. يرجى التحقق من إعداد الرابط والإنترنت."
    };
  }
}

/**
 * LocalStorage DEMO Database implementation
 */
function handleDemoRequest(params) {
  const getTable = (name, defaultData = []) => {
    const data = localStorage.getItem(`maghawry_db_${name}`);
    return data ? JSON.parse(data) : defaultData;
  };
  
  const saveTable = (name, data) => {
    localStorage.setItem(`maghawry_db_${name}`, JSON.stringify(data));
  };
  
  const action = params.action;
  
  // Seed demo data if database is empty
  if (!localStorage.getItem("maghawry_db_seeded")) {
    saveTable("Trainees", [
      {
        Timestamp: new Date().toISOString(),
        Name: "أحمد فؤاد الشافعي",
        Age: "23",
        BirthYear: "2003",
        Phone: "01012345678",
        WhatsApp: "01012345678",
        College: "الصيدلة",
        Squad: "الفرقة الخامسة",
        University: "جامعة دمياط الأهلية",
        TrainingBranch: "فرع ابو الخير",
        Status: "pending",
        Email: "",
        Password: "",
        RejectReason: "",
        CurrentLevel: "Passengers"
      },
      {
        Name: "عمر عبد العزيز خالد",
        Age: "22",
        BirthYear: "2004",
        Phone: "01234567890",
        WhatsApp: "01234567890",
        College: "الصيدلة",
        Squad: "الفرقة الرابعة",
        University: "جامعة المنصورة الأهلية",
        TrainingBranch: "فرع البنك",
        Status: "accepted",
        Email: "trainee.omar@maghawry.com",
        Password: "pass-1234",
        RejectReason: "",
        CurrentLevel: "Passengers"
      }
    ]);
    
    saveTable("Videos", [
      // Level 0 (Passengers)
      { VideoId: "d3_xQ4o6N38", Title: "آداب وأخلاقيات مهنة الصيدلة والتعامل مع الفريق", Level: "Passengers", Url: "https://www.youtube.com/watch?v=d3_xQ4o6N38" },
      { VideoId: "w3wHwT8w-8s", Title: "مقدمة التدريب العملي في صيدليات آل مغاوري", Level: "Passengers", Url: "https://www.youtube.com/watch?v=w3wHwT8w-8s" },
      
      // Level 1 (Starters)
      { VideoId: "qY-0hK-oM-0", Title: "1️⃣ OTC - تشخيص وعلاج نزلات البرد والإنفلونزا", Level: "Starters", Url: "https://www.youtube.com/watch?v=qY-0hK-oM-0" },
      
      // Level 2 (Movers)
      { VideoId: "zK6yW4o9Jt4", Title: "2️⃣ Antibiotics - بدائل وحساب جرعات المضادات الحيوية للأطفال", Level: "Movers", Url: "https://www.youtube.com/watch?v=zK6yW4o9Jt4" }
    ]);
    
    // Seed default Admins
    saveTable("Admins", [
      { Timestamp: new Date().toISOString(), Username: "madmody", Password: "madmody", Role: "Owner" }
    ]);

    // Seed default Questions
    saveTable("Questions", [
      // Level 0 (Passengers)
      { Timestamp: new Date().toISOString(), Level: "Passengers", QuestionAr: "ما هو الهدف الأساسي من آداب وأخلاقيات مهنة الصيدلة؟", QuestionEn: "What is the primary goal of pharmacy professional ethics?", Option1Ar: "زيادة أرباح الصيدلية المادية بأي طريقة كانت.", Option1En: "Increasing pharmacy profits by any means.", Option2Ar: "تقديم مصلحة ورعاية المريض بأعلى معايير الأمان والأخلاق.", Option2En: "Prioritizing patient care and safety with the highest ethical standards.", Option3Ar: "التنافس غير الشريف مع الصيدليات المجاورة.", Option3En: "Unfair competition with neighboring pharmacies.", CorrectIndex: "1" },
      { Timestamp: new Date().toISOString(), Level: "Passengers", QuestionAr: "ما هي درجة الحرارة المناسبة لتخزين الأنسولين واللقاحات الحيوية؟", QuestionEn: "What is the appropriate storage temperature for insulin and vaccines?", Option1Ar: "في درجة حرارة الغرفة العادية (25 مئوية).", Option1En: "At normal room temperature (25°C).", Option2Ar: "تحت الصفر المطلق في الفريزر.", Option2En: "Below zero in the freezer.", Option3Ar: "في الثلاجة بين درجة حرارة 2 إلى 8 درجات مئوية.", Option3En: "In the refrigerator between 2°C and 8°C.", CorrectIndex: "2" },
      { Timestamp: new Date().toISOString(), Level: "Passengers", QuestionAr: "أين تقع جميع فروع صيدليات آل مغاوري؟", QuestionEn: "Where are all El-Maghawry Pharmacies branches located?", Option1Ar: "في مدينة دمياط القديمة", Option1En: "In Old Damietta city", Option2Ar: "في مدينة دمياط الجديدة فقط", Option2En: "In New Damietta city only", Option3Ar: "في القاهرة والإسكندرية", Option3En: "In Cairo and Alexandria", CorrectIndex: "1" },
      
      // Level 1 (Starters)
      { Timestamp: new Date().toISOString(), Level: "Starters", QuestionAr: "ما هو البروتوكول الأولي المعتمد للتعامل مع حرق من الدرجة الأولى؟", QuestionEn: "What is the primary protocol to handle a first-degree burn?", Option1Ar: "وضع معجون الأسنان أو الزبدة مباشرة فوق موضع الحرق.", Option1En: "Applying toothpaste or butter directly onto the burn site.", Option2Ar: "وضع ماء جاري فاتر لمدة 10-15 دقيقة ثم استخدام مرهم حروق.", Option2En: "Placing under cool running water for 10-15 minutes, then using a burn ointment.", Option3Ar: "تغطية الحرق بلاصق طبي غير معقم فوراً.", Option3En: "Covering the burn immediately with a non-sterile adhesive tape.", CorrectIndex: "1" },
      
      // Level 2 (Movers)
      { Timestamp: new Date().toISOString(), Level: "Movers", QuestionAr: "ما هو التحذير الحرج للغاية الذي يجب توجيهه للمريض عند صرف مضاد حيوي من عائلة (Fluoroquinolones)؟", QuestionEn: "What is the highly critical warning when dispensing a Fluoroquinolone antibiotic?", Option1Ar: "عدم تناوله مع الحليب أو الكالسيوم أو الحديد لأنه يقلل امتصاصه.", Option1En: "Do not take with milk or calcium/iron supplements as it reduces absorption.", Option2Ar: "ضرورة تناوله مع عصائر الحمضيات المركزة لزيادة قوته.", Option2En: "Must be taken with concentrated juice.", Option3Ar: "تناوله مع القهوة فقط.", Option3En: "Take it with coffee only.", CorrectIndex: "0" }
    ]);

    saveTable("Progress", []);
    saveTable("Promotions", []);
    saveTable("Notifications", []);
    localStorage.setItem("maghawry_db_seeded", "true");
  }

  // Helper helper
  const verifyLocalAdmin = (pass) => {
    const trimmedPass = String(pass).trim().toLowerCase();
    if (trimmedPass === "madmody") return true;
    const admins = getTable("Admins");
    return admins.some(x => String(x.Password).trim().toLowerCase() === trimmedPass);
  };

  // API router
  if (action === "register") {
    const trainees = getTable("Trainees");
    const phone = String(params.phone).trim();
    
    if (trainees.some(t => String(t.Phone).trim() === phone)) {
      return { success: false, message: "رقم الهاتف هذا مسجل بالفعل في النظام!" };
    }
    
    if (String(params.securityAnswer) !== "1") {
      return { success: false, message: "إجابة سؤال الأمان خاطئة. يرجى التأكد من الإجابة الصحيحة." };
    }
    
    trainees.push({
      Timestamp: new Date().toISOString(),
      Name: params.name,
      Age: params.age,
      BirthYear: params.birthYear,
      Phone: phone,
      WhatsApp: params.whatsApp || "لا يوجد",
      College: params.college,
      Squad: params.squad,
      University: params.university,
      TrainingBranch: params.trainingBranch,
      Status: "pending",
      Email: "",
      Password: "",
      RejectReason: "",
      CurrentLevel: params.targetLevel || "Passengers"
    });
    
    saveTable("Trainees", trainees);
    return { success: true, message: "تم تسجيل البيانات بنجاح في نظام المراجعة (وضع التجربة)." };
    
  } else if (action === "checkStatus") {
    const trainees = getTable("Trainees");
    const phone = String(params.phone).trim();
    const t = trainees.find(x => String(x.Phone).trim() === phone);
    
    if (t) {
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
    return { success: false, message: "رقم الهاتف هذا غير مسجل في النظام." };
    
  } else if (action === "login") {
    const trainees = getTable("Trainees");
    const email = String(params.email).trim().toLowerCase();
    const password = String(params.password).trim();
    const t = trainees.find(x => String(x.Email).trim().toLowerCase() === email && String(x.Password).trim() === password);
    
    if (t) {
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
    return { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة، أو أن حسابك لم يتم قبوله بعد." };
    
  } else if (action === "changePassword") {
    const trainees = getTable("Trainees");
    const email = String(params.email).trim().toLowerCase();
    const oldPassword = String(params.oldPassword).trim();
    const newPassword = String(params.newPassword).trim();
    
    const tIndex = trainees.findIndex(x => String(x.Email).trim().toLowerCase() === email && String(x.Password).trim() === oldPassword);
    if (tIndex !== -1) {
      trainees[tIndex].Password = newPassword;
      saveTable("Trainees", trainees);
      
      const notifs = getTable("Notifications");
      notifs.push({
        Timestamp: new Date().toISOString(),
        Name: trainees[tIndex].Name,
        Email: email,
        NewPassword: newPassword
      });
      saveTable("Notifications", notifs);
      
      return { success: true, message: "تم تغيير كلمة المرور بنجاح." };
    }
    return { success: false, message: "كلمة المرور الحالية غير صحيحة." };
    
  } else if (action === "getTraineeVideos") {
    const trainees = getTable("Trainees");
    const email = String(params.email).trim().toLowerCase();
    const password = String(params.password).trim();
    
    const t = trainees.find(x => x.Status === "accepted" && String(x.Email).trim().toLowerCase() === email && String(x.Password).trim() === password);
    
    if (!t) {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    
    const currentLevel = t.CurrentLevel || "Passengers";
    const videos = getTable("Videos");
    const filteredVideos = videos.filter(x => String(x.Level || "Passengers").trim() === currentLevel);
    
    const progress = getTable("Progress");
    const watched = progress.filter(x => String(x.Email).trim().toLowerCase() === email).map(x => String(x.VideoId).trim());
    
    const promotions = getTable("Promotions");
    const completedLevels = promotions.filter(x => String(x.Email).trim().toLowerCase() === email && x.Status === "approved").map(x => String(x.FromLevel));
    const pendingPromotion = promotions.some(x => String(x.Email).trim().toLowerCase() === email && x.Status === "pending");
    
    // Load local questions dynamically for their level
    const allQuestions = getTable("Questions");
    const levelQuestions = allQuestions.filter(x => String(x.Level).trim() === currentLevel).map(x => {
      return {
        q: x.QuestionAr,
        q_en: x.QuestionEn,
        options: [x.Option1Ar, x.Option2Ar, x.Option3Ar].filter(Boolean),
        options_en: [x.Option1En, x.Option2En, x.Option3En].filter(Boolean),
        correct: parseInt(x.CorrectIndex) || 0
      };
    });

    return {
      success: true,
      videos: filteredVideos,
      watched: watched,
      currentLevel: currentLevel,
      completedLevels: completedLevels,
      pendingPromotion: pendingPromotion,
      questions: levelQuestions
    };
    
  } else if (action === "updateProgress") {
    const trainees = getTable("Trainees");
    const email = String(params.email).trim().toLowerCase();
    const password = String(params.password).trim();
    const videoId = String(params.videoId).trim();
    
    const authorized = trainees.some(x => x.Status === "accepted" && String(x.Email).trim().toLowerCase() === email && String(x.Password).trim() === password);
    if (!authorized) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    
    const progress = getTable("Progress");
    if (!progress.some(x => String(x.Email).trim().toLowerCase() === email && String(x.VideoId).trim() === videoId)) {
      progress.push({
        Timestamp: new Date().toISOString(),
        Email: email,
        VideoId: videoId
      });
      saveTable("Progress", progress);
    }
    return { success: true, message: "تم تسجيل إتمام المشاهدة بنجاح." };
    
  } else if (action === "submitPromotionRequest") {
    const trainees = getTable("Trainees");
    const email = String(params.email).trim().toLowerCase();
    const password = String(params.password).trim();
    const fromLevel = String(params.fromLevel).trim();
    const toLevel = String(params.toLevel).trim();
    
    const authorized = trainees.some(x => x.Status === "accepted" && String(x.Email).trim().toLowerCase() === email && String(x.Password).trim() === password);
    if (!authorized) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    
    const promotions = getTable("Promotions");
    const exist = promotions.find(x => String(x.Email).trim().toLowerCase() === email && String(x.FromLevel).trim() === fromLevel && String(x.ToLevel).trim() === toLevel);
    
    if (exist) {
      if (exist.Status === "pending") {
        return { success: false, message: "لديك طلب ترقية معلق بالفعل قيد المراجعة!" };
      } else if (exist.Status === "approved") {
        return { success: false, message: "لقد تمت ترقيتك واجتيازك هذا المستوى بالفعل!" };
      }
    }
    
    promotions.push({
      Timestamp: new Date().toISOString(),
      Email: email,
      FromLevel: fromLevel,
      ToLevel: toLevel,
      Status: "pending"
    });
    saveTable("Promotions", promotions);
    return { success: true, message: "تم إرسال طلب الترقية وإصدار الشهادة بنجاح للمدير." };

  } else if (action === "adminLogin") {
    if (verifyLocalAdmin(params.password)) {
      return { success: true, message: "تم تسجيل الدخول بنجاح كمدير." };
    }
    return { success: false, message: "رمز المرور غير صحيح." };
    
  } else if (action === "adminGetTrainees") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    return { success: true, trainees: getTable("Trainees") };
    
  } else if (action === "adminAction") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    const trainees = getTable("Trainees");
    const phone = String(params.phone).trim();
    const actionState = params.actionState;
    
    const tIndex = trainees.findIndex(x => String(x.Phone).trim() === phone);
    if (tIndex !== -1) {
      if (actionState === "accept") {
        trainees[tIndex].Status = "accepted";
        trainees[tIndex].Email = params.generatedEmail;
        trainees[tIndex].Password = params.generatedPassword;
        trainees[tIndex].RejectReason = "";
        trainees[tIndex].CurrentLevel = params.currentLevel || trainees[tIndex].CurrentLevel || "Passengers";
      } else {
        trainees[tIndex].Status = "rejected";
        trainees[tIndex].RejectReason = params.rejectReason;
      }
      saveTable("Trainees", trainees);
      return { success: true, message: "تم حفظ الإجراء بنجاح." };
    }
    return { success: false, message: "لم يتم العثور على المتدرب." };
    
  } else if (action === "adminGetVideos") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    return { success: true, videos: getTable("Videos") };
    
  } else if (action === "adminAddVideo") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    const videos = getTable("Videos");
    const url = String(params.url).trim();
    const title = String(params.title).trim();
    const level = String(params.level || "Passengers").trim();
    
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return { success: false, message: "رابط يوتيوب غير صالح!" };
    }
    
    videos.push({
      Timestamp: new Date().toISOString(),
      VideoId: videoId,
      Title: title,
      Url: url,
      Level: level
    });
    saveTable("Videos", videos);
    return { success: true, message: "تم إضافة الفيديو للمستوى بنجاح." };
    
  } else if (action === "adminDeleteVideo") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    const videos = getTable("Videos");
    const videoId = String(params.videoId).trim();
    const vIndex = videos.findIndex(x => String(x.VideoId).trim() === videoId);
    if (vIndex !== -1) {
      videos.splice(vIndex, 1);
      saveTable("Videos", videos);
      return { success: true, message: "تم حذف الفيديو بنجاح." };
    }
    return { success: false, message: "لم يتم العثور على الفيديو." };
    
  } else if (action === "adminGetNotifications") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    return { success: true, notifications: getTable("Notifications") };
    
  } else if (action === "adminGetPromotions") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    const promotions = getTable("Promotions");
    const trainees = getTable("Trainees");
    
    const enhanced = promotions.map(p => {
      const t = trainees.find(x => String(x.Email).trim().toLowerCase() === String(p.Email).trim().toLowerCase());
      p.StudentName = t ? t.Name : "متدرب مجهول";
      return p;
    });
    return { success: true, promotions: enhanced };
    
  } else if (action === "adminApprovePromotion") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    const email = String(params.email).trim().toLowerCase();
    const fromLevel = String(params.fromLevel).trim();
    const toLevel = String(params.toLevel).trim();
    
    const trainees = getTable("Trainees");
    const promotions = getTable("Promotions");
    
    const tIndex = trainees.findIndex(x => String(x.Email).trim().toLowerCase() === email);
    if (tIndex !== -1) {
      trainees[tIndex].CurrentLevel = toLevel;
      saveTable("Trainees", trainees);
      
      const pIndex = promotions.findIndex(x => String(x.Email).trim().toLowerCase() === email && String(x.FromLevel).trim() === fromLevel && String(x.ToLevel).trim() === toLevel);
      if (pIndex !== -1) {
        promotions[pIndex].Status = "approved";
        saveTable("Promotions", promotions);
      }
      return { success: true, message: "تمت الموافقة على الترقية وإصدار الشهادة بنجاح." };
    }
    return { success: false, message: "فشل تحديث مستوى المتدرب." };

  } else if (action === "adminGetAdmins") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    return { success: true, admins: getTable("Admins") };

  } else if (action === "adminAddAdmin") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    const admins = getTable("Admins");
    admins.push({
      Timestamp: new Date().toISOString(),
      Username: params.username.trim(),
      Password: params.password.trim(),
      Role: params.role || "Admin"
    });
    saveTable("Admins", admins);
    return { success: true, message: "تم إضافة المدير الجديد بنجاح." };

  } else if (action === "adminGetQuestions") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    return { success: true, questions: getTable("Questions") };

  } else if (action === "adminAddQuestion") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    const questions = getTable("Questions");
    questions.push({
      Timestamp: new Date().toISOString(),
      Level: params.level,
      QuestionAr: params.questionAr,
      QuestionEn: params.questionEn,
      Option1Ar: params.option1Ar,
      Option1En: params.option1En,
      Option2Ar: params.option2Ar,
      Option2En: params.option2En,
      Option3Ar: params.option3Ar,
      Option3En: params.option3En,
      CorrectIndex: params.correctIndex
    });
    saveTable("Questions", questions);
    return { success: true, message: "تم إضافة السؤال بنجاح للمستوى." };

  } else if (action === "adminDeleteQuestion") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    const questions = getTable("Questions");
    const index = parseInt(params.index);
    if (index >= 0 && index < questions.length) {
      questions.splice(index, 1);
      saveTable("Questions", questions);
      return { success: true, message: "تم حذف السؤال بنجاح." };
    }
    return { success: false, message: "فشل حذف السؤال." };

  } else if (action === "adminEditTrainee") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    const trainees = getTable("Trainees");
    const phone = String(params.phone).trim();
    const tIndex = trainees.findIndex(x => String(x.Phone).trim() === phone);
    if (tIndex !== -1) {
      trainees[tIndex].Name = params.name;
      trainees[tIndex].Email = params.email;
      trainees[tIndex].CurrentLevel = params.level;
      trainees[tIndex].TrainingBranch = params.branch;
      saveTable("Trainees", trainees);
      return { success: true, message: "تم تعديل بيانات المتدرب بنجاح." };
    }
    return { success: false, message: "لم يتم العثور على المتدرب." };

  } else if (action === "adminToggleBlockTrainee") {
    if (!verifyLocalAdmin(params.adminPassword)) {
      return { success: false, message: "غير مصرح بالعملية." };
    }
    const trainees = getTable("Trainees");
    const phone = String(params.phone).trim();
    const tIndex = trainees.findIndex(x => String(x.Phone).trim() === phone);
    if (tIndex !== -1) {
      trainees[tIndex].Status = params.state;
      saveTable("Trainees", trainees);
      return { success: true, message: params.state === "blocked" ? "تم حظر الحساب بنجاح." : "تم تنشيط الحساب بنجاح." };
    }
    return { success: false, message: "لم يتم العثور على المتدرب." };
  }

  return { success: false, message: "Unknown action" };
}

// Utility function to extract YouTube ID
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Global Toast helper
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
  }
  
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "8px";
  toast.style.color = "#fff";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "bold";
  toast.style.fontFamily = "Cairo, sans-serif";
  toast.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
  toast.style.direction = "rtl";
  toast.style.textAlign = "right";
  toast.style.animation = "slideUp 0.3s ease forwards";
  
  if (type === "success") {
    toast.style.backgroundColor = "#10b981";
  } else if (type === "error") {
    toast.style.backgroundColor = "#ef4444";
  } else {
    toast.style.backgroundColor = "#f59e0b";
  }
  
  toast.innerHTML = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.5s ease forwards";
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 4000);
}

// Inject Keyframes for animations
if (!document.getElementById("toast-animations")) {
  const style = document.createElement("style");
  style.id = "toast-animations";
  style.innerHTML = `
    @keyframes slideUp {
      from { transform: translateY(100px) translateX(-50%); opacity: 0; }
      to { transform: translateY(0) translateX(-50%); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}
