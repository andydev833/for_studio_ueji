// ===========================
// Config - 商品別設定管理
// ===========================
// 管理者が後からCTA・予約金・カレンダー枠・完了文言を変更可能

const StudioConfig = {
  // --- LINE ---
  lineUrl: 'https://line.me/R/ti/p/@studio-ueji',

  // --- プロポーズプレミアム ---
  propose: {
    name: 'プロポーズプレミアム',
    ctaMain: 'LINEで相談する',
    ctaSub: '無料相談の日程を選ぶ',
    lineUrl: 'https://line.me/R/ti/p/@studio-ueji',
    formAction: '/api/propose-inquiry',
    calendarEnabled: true,
    calendarMode: 'consultation', // consultation | shooting
    calendarLabel: '相談日を選ぶ',
    paymentEnabled: false,
    depositAmount: 0,
    slotDuration: 60, // 分
    slotTimes: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    closedDays: [0], // 0=日曜
    blockedDates: [],
    completeTitle: 'ご相談ありがとうございます',
    completeMessage: '大切なプロポーズに向けて、まずはご希望や不安をお聞かせください。内容を確認のうえ、担当者よりご連絡いたします。',
    autoReplySubject: 'プロポーズプレミアム相談のお申し込みを受け付けました',
    steps: ['method', 'content', 'timing', 'calendar', 'info', 'confirm', 'complete'],
  },

  // --- 七五三 ---
  shichigosan: {
    name: '七五三撮影',
    ctaMain: '空き日程を確認する',
    ctaSub: '七五三撮影を予約する',
    lineUrl: 'https://line.me/R/ti/p/@studio-ueji',
    formAction: '/api/shichigosan-booking',
    calendarEnabled: true,
    calendarMode: 'shooting',
    calendarLabel: '撮影候補日を選ぶ',
    paymentEnabled: true,
    depositAmount: 5500,
    depositLabel: '予約金',
    slotDuration: 120,
    slotTimes: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
    closedDays: [2], // 火曜
    blockedDates: [],
    completeTitle: 'お問い合わせありがとうございます',
    completeMessage: 'お子様の年齢やご家族の参加状況を確認のうえ、最適な撮影内容をご案内いたします。',
    completeMessagePaid: '予約金のお支払いありがとうございます。担当者より撮影内容確認のご連絡をいたします。',
    autoReplySubject: '七五三撮影のお申し込みを受け付けました',
    steps: ['menu', 'child', 'family', 'calendar', 'options', 'info', 'payment', 'confirm', 'complete'],
    maxPreferences: 3, // 第1〜第3希望
  },

  // --- プロフィール撮影（個人） ---
  profilePersonal: {
    name: 'プロフィール撮影（個人）',
    ctaMain: 'プロフィール撮影を予約する',
    ctaSub: '個人撮影を相談する',
    lineUrl: 'https://line.me/R/ti/p/@studio-ueji',
    formAction: '/api/profile-personal-booking',
    calendarEnabled: true,
    calendarMode: 'shooting',
    calendarLabel: '撮影日を選ぶ',
    paymentEnabled: true,
    depositAmount: 5500,
    depositLabel: '予約金',
    slotDuration: 90,
    slotTimes: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    closedDays: [2],
    blockedDates: [],
    completeTitle: 'ご予約ありがとうございます',
    completeMessage: '撮影内容を確認のうえ、担当者よりご連絡いたします。',
    autoReplySubject: 'プロフィール撮影のご予約を受け付けました',
    steps: ['purpose', 'menu', 'calendar', 'info', 'payment', 'confirm', 'complete'],
  },

  // --- プロフィール撮影（企業） ---
  profileCorporate: {
    name: 'プロフィール撮影（企業・チーム）',
    ctaMain: '企業撮影を相談する',
    ctaSub: '社員撮影の見積を相談する',
    lineUrl: 'https://line.me/R/ti/p/@studio-ueji',
    formAction: '/api/profile-corporate-inquiry',
    calendarEnabled: true,
    calendarMode: 'consultation',
    calendarLabel: '相談日を選ぶ',
    paymentEnabled: false,
    depositAmount: 0,
    slotDuration: 60,
    slotTimes: ['10:00', '11:00', '13:00', '14:00', '15:00'],
    closedDays: [0, 2],
    blockedDates: [],
    completeTitle: 'ご相談ありがとうございます',
    completeMessage: '撮影人数・用途・撮影場所を確認のうえ、最適な撮影内容とお見積りをご案内いたします。',
    autoReplySubject: '企業撮影のご相談を受け付けました',
    steps: ['purpose', 'scale', 'calendar', 'info', 'confirm', 'complete'],
  },

  // --- 共通設定 ---
  common: {
    businessHoursStart: 9,
    businessHoursEnd: 18,
    calendarMonthsAhead: 3,
    maxFileSize: 10 * 1024 * 1024,
  },
};

// グローバルに公開
window.StudioConfig = StudioConfig;
