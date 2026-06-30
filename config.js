/**
 * PharmReady-AlmaghwryBy-Fadel - Configuration & API Wrapper (Updated)
 * 
 * Instructions:
 * 1. Deploy the code from google-script.js as a Google Apps Script Web App.
 * 2. Paste the Web App URL in the API_URL variable below.
 * 3. If API_URL is left empty or as placeholder, the system will run in "Demo Mode" 
 *    using browser LocalStorage, allowing you to test everything immediately without Google Sheets!
 */

const API_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// Check if we are running in Demo Mode
const isDemoMode = !API_URL || API_URL.includes("YOUR_GOOGLE_APPS_SCRIPT");

console.log(isDemoMode ? "🚀 Running in DEMO MODE (using LocalStorage)" : "🌐 Running in CLOUD MODE (connected to Google Sheets)");

/**
 * Quiz Questions Data for Level Exams
 */
const EXAM_QUESTIONS = {
  "Passengers": [
    {
      q: "ما هو الهدف الأساسي من آداب وأخلاقيات مهنة الصيدلة؟",
      q_en: "What is the primary goal of pharmacy professional ethics?",
      options: [
        "زيادة أرباح الصيدلية المادية بأي طريقة كانت.",
        "تقديم مصلحة ورعاية المريض بأعلى معايير الأمان والأخلاق.",
        "التنافس غير الشريف مع الصيدليات المجاورة."
      ],
      options_en: [
        "Increasing pharmacy profits by any means.",
        "Prioritizing patient care and safety with the highest ethical standards.",
        "Unfair competition with neighboring pharmacies."
      ],
      correct: 1
    },
    {
      q: "ما هي درجة الحرارة المناسبة لتخزين الأنسولين واللقاحات الحيوية؟",
      q_en: "What is the appropriate storage temperature for insulin and vaccines?",
      options: [
        "في درجة حرارة الغرفة العادية (25 مئوية).",
        "تحت الصفر المطلق في الفريزر.",
        "في الثلاجة بين درجة حرارة 2 إلى 8 درجات مئوية."
      ],
      options_en: [
        "At normal room temperature (25°C).",
        "Below zero in the freezer.",
        "In the refrigerator between 2°C and 8°C."
      ],
      correct: 2
    },
    {
      q: "ما هي الخطوة الأولى المهنية عند استلام وصفة طبية (روشتة) من المريض؟",
      q_en: "What is the first professional step when receiving a prescription from a patient?",
      options: [
        "صرف الأدوية بسرعة دون مراجعة تفاصيل الجرعات.",
        "قراءتها بدقة والتحقق من اسم المريض والجرعات وتوافق المكونات.",
        "إخبار المريض بنقص الأدوية دون التحقق من الرفوف."
      ],
      options_en: [
        "Dispensing medications quickly without reviewing dosage details.",
        "Reading it carefully and verifying patient name, dosage, and compatibility.",
        "Telling the patient medications are out of stock without checking shelves."
      ],
      correct: 1
    },
    {
      q: "ماذا يرمز مصطلح OTC في عالم الصيدلة؟",
      q_en: "What does the term OTC stand for in pharmacy?",
      options: [
        "الأدوية المخدرة والممنوعة قانونياً بدون موافقة أمنية.",
        "الأدوية التي يمكن صرفها بأمان للمريض دون روشتة طبية لعلاج أعراض بسيطة.",
        "أدوية غرف الطوارئ والعمليات الحرجة فقط."
      ],
      options_en: [
        "Narcotics legally prohibited without security approval.",
        "Medications that can be safely dispensed without a prescription for mild symptoms.",
        "Emergency room and critical surgery medications only."
      ],
      correct: 1
    },
    {
      q: "كيف تتصرف إذا طلب مريض دواء ناقصاً في السوق وليس له بديل مباشر؟",
      q_en: "How do you act if a patient requests a out-of-stock medication with no direct alternative?",
      options: [
        "تصرف له أي علبة دواء متوفرة لديك لتعويضه.",
        "تطلب منه مغادرة الصيدلية والبحث في مكان آخر بنبرة جافة.",
        "تنصحه بالرجوع للطبيب المعالج لتغيير الدواء، أو تبحث معه عن بدائل تحت إشراف المشرف."
      ],
      options_en: [
        "Dispensing any available medication box to compensate him.",
        "Asking him dryly to leave the pharmacy and search elsewhere.",
        "Advising him to consult the treating doctor to change the drug, or look for alternatives under supervision."
      ],
      correct: 2
    }
  ],
  "Starters": [
    {
      q: "ما هو البروتوكول الأولي المعتمد في حقيبة الإسعافات الأولية للتعامل مع حرق من الدرجة الأولى؟",
      q_en: "What is the primary protocol in a first aid kit to handle a first-degree burn?",
      options: [
        "وضع معجون الأسنان أو الزبدة مباشرة فوق موضع الحرق.",
        "وضع ماء جاري فاتر (وليس بارداً جداً) لمدة 10-15 دقيقة ثم استخدام مرهم حروق.",
        "تغطية الحرق بلاصق طبي غير معقم فوراً لمنع التنفس."
      ],
      options_en: [
        "Applying toothpaste or butter directly onto the burn site.",
        "Placing under cool running water (not freezing) for 10-15 minutes, then using a burn ointment.",
        "Covering the burn immediately with a non-sterile adhesive tape to block air."
      ],
      correct: 1
    },
    {
      q: "أي المجموعات الدوائية التالية تستخدم لخفض الحرارة وتسكين الآلام بأمان للأطفال؟",
      q_en: "Which of the following drug classes is used to safely reduce fever and relieve pain in children?",
      options: [
        "مادة الباراسيتامول (Paracetamol) بالجرعة المحسوبة حسب وزن الطفل.",
        "مادة الأسبرين (Aspirin) بجرعات كبيرة لضمان سرعة المفعول.",
        "مضادات الالتهاب غير الستيرويدية دون استشارة طبية."
      ],
      options_en: [
        "Paracetamol in a calculated dose based on the child's weight.",
        "Aspirin in high doses to guarantee quick action.",
        "Non-steroidal anti-inflammatory drugs (NSAIDs) without medical consultation."
      ],
      correct: 0
    },
    {
      q: "ما هو تصنيف مادة (Ibuprofen) الطبي وكيف يجب نصح المريض بتناوله؟",
      q_en: "What is the medical classification of Ibuprofen, and how should you advise the patient to take it?",
      options: [
        "مضاد حيوي قوي، ويجب تناوله على معدة فارغة تماماً.",
        "مسكن ألم ومضاد التهاب غير ستيرويدي (NSAID)، ويجب تناوله بعد الأكل لتجنب تهيج المعدة.",
        "فيتامين مقوي للأعصاب، ويؤخذ قبل النوم مباشرة."
      ],
      options_en: [
        "A strong antibiotic, to be taken on an empty stomach.",
        "A non-steroidal anti-inflammatory drug (NSAID) painkiller, to be taken after meals to avoid stomach irritation.",
        "A nerve-supporting vitamin, taken right before bed."
      ],
      correct: 1
    }
  ],
  "Movers": [
    {
      q: "ما هو التحذير الحرج للغاية الذي يجب توجيهه للمريض عند صرف مضاد حيوي من عائلة (Fluoroquinolones) مثل Ciprofloxacin؟",
      q_en: "What is the highly critical warning to give a patient when dispensing a Fluoroquinolone antibiotic like Ciprofloxacin?",
      options: [
        "عدم تناوله مع الحليب أو المكملات الغذائية المحتوية على الكالسيوم أو الحديد لأنه يقلل امتصاصه.",
        "ضرورة تناوله مع عصائر الحمضيات المركزة لزيادة قوته.",
        "تناوله مع القهوة والشاي فقط لتجنب الدوخة."
      ],
      options_en: [
        "Do not take with milk or calcium/iron supplements as it reduces absorption.",
        "Must be taken with concentrated citrus juices to increase strength.",
        "Take it with coffee and tea only to avoid dizziness."
      ],
      correct: 0
    },
    {
      q: "ما هو الفحص المخبري الأساسي المستخدم لتشخيص ومتابعة علاج مرضى السكري على المدى الطويل (3 أشهر)؟",
      q_en: "What is the primary lab test used to diagnose and monitor long-term (3-month) diabetes treatment?",
      options: [
        "فحص السكر العشوائي (RBS).",
        "فحص السكر التراكمي (HbA1c).",
        "تحليل البول العام لوجود الأسيتون."
      ],
      options_en: [
        "Random Blood Sugar (RBS).",
        "Glycated Hemoglobin (HbA1c) / Cumulative Sugar.",
        "General urinalysis for acetone."
      ],
      correct: 1
    }
  ],
  "Flyers": [
    {
      q: "عند تحضير تركيبة صيدلانية تجميلية تحتوي على فيتامين C، كيف يجب حماية المستحضر من الأكسدة وتلف المادة الفعالة؟",
      q_en: "When preparing a cosmetic formulation containing Vitamin C, how should you protect the product from oxidation and active degradation?",
      options: [
        "تعبئته في عبوات زجاجية معتمة أو داكنة اللون، وحفظه في مكان بارد وبعيد عن الضوء والهواء.",
        "إضافة كميات كبيرة من الكحول الطبي لتعقيم المحلول وتسريع التطاير.",
        "تركه معرضاً للهواء المباشر والضوء لتنشيط جزيئات الفيتامين."
      ],
      options_en: [
        "Packaging it in opaque or dark amber glass bottles, storing it in a cool place away from light and air.",
        "Adding large amounts of rubbing alcohol to sterilize the solution and accelerate evaporation.",
        "Leaving it exposed to direct air and light to activate vitamin molecules."
      ],
      correct: 0
    },
    {
      q: "ما هي المعادلة الذهبية المتبعة لإدارة طلبيات الأدوية والنواقص في الصيدلية لضمان عدم ركود البضائع؟",
      q_en: "What is the golden equation for managing drug orders and shortages in the pharmacy to avoid stagnant stock?",
      options: [
        "شراء كميات ضخمة من جميع الأصناف دون النظر لمعدل الاستهلاك اليومي.",
        "حساب معدل السحب اليومي والشهري لكل صنف، والطلب بناءً على حد الأمان والطلب الأدنى (Min/Max Level).",
        "إيقاف الطلبيات تماماً والاعتماد فقط على تبادل الأصناف مع الصيدليات الأخرى."
      ],
      options_en: [
        "Buying huge quantities of all items regardless of daily consumption rate.",
        "Calculating daily/monthly consumption for each item and ordering based on Min/Max safety levels.",
        "Stopping orders completely and relying solely on stock swaps with other pharmacies."
      ],
      correct: 1
    }
  ]
};

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
        University: "جامعة دمياط",
        TrainingBranch: "فرع دمياط الجديدة (الرئيسي)",
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
        University: "جامعة المنصورة",
        TrainingBranch: "فرع دمياط الجديدة (الرئيسي)",
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
      { VideoId: "e9R8m4bHjU0", Title: "أقسام الصيدلية وكيفية ترتيب الأدوية وحفظها", Level: "Passengers", Url: "https://www.youtube.com/watch?v=e9R8m4bHjU0" },
      
      // Level 1 (Starters)
      { VideoId: "qY-0hK-oM-0", Title: "1️⃣ OTC - تشخيص وعلاج نزلات البرد والإنفلونزا", Level: "Starters", Url: "https://www.youtube.com/watch?v=qY-0hK-oM-0" },
      { VideoId: "tV1yWzL3O8s", Title: "3️⃣ First aid - الإسعافات الأولية للجروح والكسور والنزيف", Level: "Starters", Url: "https://www.youtube.com/watch?v=tV1yWzL3O8s" },
      { VideoId: "uW8zN7dJ3m4", Title: "8️⃣ Basic Pharma - أساسيات تصنيف وحساب جرعات الأدوية", Level: "Starters", Url: "https://www.youtube.com/watch?v=uW8zN7dJ3m4" },
      
      // Level 2 (Movers)
      { VideoId: "zK6yW4o9Jt4", Title: "2️⃣ Antibiotics - بدائل وحساب جرعات المضادات الحيوية للأطفال", Level: "Movers", Url: "https://www.youtube.com/watch?v=zK6yW4o9Jt4" },
      { VideoId: "mN2yW6b3M8y", Title: "6️⃣ Medical Analysis - قراءة التحاليل الطبية وفحص وظائف الكبد والكلى", Level: "Movers", Url: "https://www.youtube.com/watch?v=mN2yW6b3M8y" }
    ]);
    
    saveTable("Progress", []);
    saveTable("Promotions", []);
    saveTable("Notifications", []);
    localStorage.setItem("maghawry_db_seeded", "true");
  }

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
    const t = trainees.find(x => x.Status === "accepted" && String(x.Email).trim().toLowerCase() === email && String(x.Password).trim() === password);
    
    if (t) {
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
    
    return {
      success: true,
      videos: filteredVideos,
      watched: watched,
      currentLevel: currentLevel,
      completedLevels: completedLevels,
      pendingPromotion: pendingPromotion
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
    if (String(params.password).trim() === "madmody") {
      return { success: true, message: "تم تسجيل الدخول بنجاح كمدير." };
    }
    return { success: false, message: "رمز المرور غير صحيح." };
    
  } else if (action === "adminGetTrainees") {
    if (String(params.adminPassword).trim() !== "madmody") {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    return { success: true, trainees: getTable("Trainees") };
    
  } else if (action === "adminAction") {
    if (String(params.adminPassword).trim() !== "madmody") {
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
    if (String(params.adminPassword).trim() !== "madmody") {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    return { success: true, videos: getTable("Videos") };
    
  } else if (action === "adminAddVideo") {
    if (String(params.adminPassword).trim() !== "madmody") {
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
    if (String(params.adminPassword).trim() !== "madmody") {
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
    if (String(params.adminPassword).trim() !== "madmody") {
      return { success: false, message: "غير مصرح بالدخول." };
    }
    return { success: true, notifications: getTable("Notifications") };
    
  } else if (action === "adminGetPromotions") {
    if (String(params.adminPassword).trim() !== "madmody") {
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
    if (String(params.adminPassword).trim() !== "madmody") {
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
