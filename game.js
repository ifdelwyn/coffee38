// GAME LOGIC: TIỆM CÀ PHÊ NHỎ (CHỦ ĐỀ CÀ PHÊ VỈA HÈ / CÀ PHÊ MUỐI)
// Bám sát 100% cấu trúc và logic từ mã nguồn Tiệm Mì Cay (aenhatrang.com)

// LÃI SUẤT CƠ SỞ THAM CHIẾU VIETCOMBANK (VCB) DÀNH CHO VAY VỐN KINH DOANH
const VCB_BASE_RATE = 4.8; // 4.80%/kỳ

const ITEMS = {
  cafe_den:    { n: "Cà phê phin",   icon: "☕", cost: 4000,  sell: 15000, unlock: 0,      type: "base" },
  sua_dac:     { n: "Sữa đặc",       icon: "🥫", cost: 3000,  sell: 10000, unlock: 0,      type: "sweet" },
  da_vien:     { n: "Đá viên",       icon: "🧊", cost: 1000,  sell: 5000,  unlock: 0,      type: "ice" },
  kem_muoi:    { n: "Kem muối",      icon: "🧂", cost: 5000,  sell: 20000, unlock: 0,      type: "cream" },
  kem_trung:   { n: "Kem trứng",     icon: "🥚", cost: 6000,  sell: 22000, unlock: 80000,  type: "cream" },
  sua_tuoi:    { n: "Sữa tươi",      icon: "🥛", cost: 4000,  sell: 12000, unlock: 0,      type: "sweet" },
  tra_dao:     { n: "Trà đào",       icon: "🍑", cost: 5000,  sell: 18000, unlock: 0,      type: "base" },
  cam_sa:      { n: "Cam & Sả",      icon: "🍊", cost: 3000,  sell: 10000, unlock: 0,      type: "fruit" },
  huong_duong: { n: "Hướng dương",   icon: "🌻", cost: 4000,  sell: 12000, unlock: 0,      type: "snack" },
  croissant:   { n: "Bánh sừng bò",  icon: "🥐", cost: 8000,  sell: 25000, unlock: 120000, type: "snack" },
  matcha:      { n: "Bột Matcha",    icon: "🍵", cost: 6000,  sell: 22000, unlock: 150000, type: "base" },
  tran_chau:   { n: "Trân châu",     icon: "🧋", cost: 3000,  sell: 10000, unlock: 100000, type: "top" },
  cacao:       { n: "Bột Cacao",     icon: "🍫", cost: 4000,  sell: 15000, unlock: 140000, type: "base" },
  chanh:       { n: "Chanh tươi",    icon: "🍋", cost: 2000,  sell: 8000,  unlock: 0,      type: "fruit" },
  vai_thieu:   { n: "Vải ngâm",      icon: "🍒", cost: 5000,  sell: 18000, unlock: 180000, type: "fruit" },
  nuoc_dua:    { n: "Cốt dừa",       icon: "🥥", cost: 5000,  sell: 18000, unlock: 200000, type: "cream" },
  bac_ha:      { n: "Lá bạc hà",     icon: "🌿", cost: 2000,  sell: 6000,  unlock: 0,      type: "top" },
  duong_phen:  { n: "Đường phèn",    icon: "🍬", cost: 1000,  sell: 4000,  unlock: 0,      type: "sweet" },
  banh_chuoi:  { n: "Bánh chuối",    icon: "🍌", cost: 6000,  sell: 18000, unlock: 220000, type: "snack" },
  sua_chua:    { n: "Sữa chua",      icon: "🍶", cost: 5000,  sell: 16000, unlock: 250000, type: "sweet" },
  hat_sen:     { n: "Hạt sen vàng",  icon: "🪷", cost: 6000,  sell: 20000, unlock: 300000, type: "top" }
};

const RECIPES = [
  // 1. CÀ PHÊ PHIN TRUYỀN THỐNG (8 món)
  { id: "den_da",         n: "Cà phê đen đá",                 price: 15000, ings: ["cafe_den", "da_vien"], cat: "cafe_phin", desc: "Đậm đà vị cà phê phin Robusta truyền thống" },
  { id: "den_nong",       n: "Cà phê đen nóng",               price: 15000, ings: ["cafe_den"], cat: "cafe_phin", desc: "Hương thơm nồng nàn, tỉnh táo buổi sáng" },
  { id: "sua_da",         n: "Cà phê sữa đá truyền thống",    price: 20000, ings: ["cafe_den", "sua_dac", "da_vien"], cat: "cafe_phin", desc: "Biểu tượng thức uống vỉa hè đậm đà" },
  { id: "sua_nong",       n: "Cà phê sữa nóng",               price: 20000, ings: ["cafe_den", "sua_dac"], cat: "cafe_phin", desc: "Ấm bụng ngày mưa se lạnh" },
  { id: "bac_xiu",        n: "Bạc xỉu 3 tầng đá",              price: 25000, ings: ["sua_dac", "sua_tuoi", "cafe_den", "da_vien"], cat: "cafe_phin", desc: "Nhiều sữa ít cà phê, 3 tầng bắt mắt" },
  { id: "bac_xiu_nong",   n: "Bạc xỉu nóng",                  price: 25000, ings: ["sua_dac", "sua_tuoi", "cafe_den"], cat: "cafe_phin", desc: "Ngọt thơm vị sữa cùng thoang thoảng cà phê" },
  { id: "cf_duong_phen",  n: "Cà phê đường phèn thanh mát",   price: 18000, ings: ["cafe_den", "duong_phen", "da_vien"], cat: "cafe_phin", desc: "Vị đắng dịu ngọt thanh của đường phèn" },
  { id: "cf_sua_tuoi",    n: "Cà phê sữa tươi đá",            price: 22000, ings: ["cafe_den", "sua_tuoi", "da_vien"], cat: "cafe_phin", desc: "Nhẹ nhàng, béo ngậy sữa tươi thanh trùng" },

  // 2. CÀ PHÊ ĐẶC SẢN & BIẾN TẤU (8 món)
  { id: "cf_muoi",        n: "Cà phê muối béo ngậy xứ Huế",  price: 30000, ings: ["cafe_den", "sua_dac", "kem_muoi", "da_vien"], cat: "cafe_dac_san", desc: "Lớp kem muối béo mằn mặn hòa quyện cà phê" },
  { id: "cf_trung",       n: "Cà phê trứng Hà Nội",          price: 35000, ings: ["cafe_den", "sua_dac", "kem_trung"], cat: "cafe_dac_san", desc: "Kem trứng bông mịn đặc sản phố cổ" },
  { id: "cf_dua",         n: "Cà phê cốt dừa Hải Phòng",     price: 32000, ings: ["cafe_den", "nuoc_dua", "sua_dac", "da_vien"], cat: "cafe_dac_san", desc: "Vị dừa ngậy béo kết hợp cà phê đậm đà" },
  { id: "cf_sua_chua",    n: "Cà phê sữa chua đá",            price: 28000, ings: ["cafe_den", "sua_chua", "sua_dac", "da_vien"], cat: "cafe_dac_san", desc: "Chua ngọt lạ miệng, kích thích vị giác" },
  { id: "cf_cam_sa",      n: "Cà phê cam sả Coldbrew",       price: 35000, ings: ["cafe_den", "cam_sa", "da_vien"], cat: "cafe_dac_san", desc: "Thanh mát hương cam sả, cực kỳ sảng khoái" },
  { id: "cf_chanh",       n: "Cà phê chanh tươi mát lạnh",   price: 25000, ings: ["cafe_den", "chanh", "duong_phen", "da_vien"], cat: "cafe_dac_san", desc: "Sự kết hợp bất ngờ giữa vị đắng và chua ngọt" },
  { id: "cf_bac_ha",      n: "Cà phê bạc hà băng giá",       price: 28000, ings: ["cafe_den", "bac_ha", "sua_tuoi", "da_vien"], cat: "cafe_dac_san", desc: "The mát bừng tỉnh từng giác quan" },
  { id: "cf_kem_trung_da",n: "Cà phê kem trứng đá tuyết",    price: 35000, ings: ["cafe_den", "kem_trung", "da_vien"], cat: "cafe_dac_san", desc: "Lớp kem trứng sánh mịn trên nền đá lạnh" },

  // 3. TRÀ TRÁI CÂY NHIỆT ĐỚI (10 món)
  { id: "tra_dao_cs",     n: "Trà đào cam sả thanh mát",      price: 28000, ings: ["tra_dao", "cam_sa", "da_vien"], cat: "tra_trai_cay", desc: "Đào thơm ngọt cùng tinh dầu cam sả" },
  { id: "tra_chanh_vh",   n: "Trà chanh vỉa hè giã tay",      price: 15000, ings: ["tra_dao", "chanh", "duong_phen", "da_vien"], cat: "tra_trai_cay", desc: "Trà chanh phố phường chua ngọt sảng khoái" },
  { id: "tra_vai_sen",    n: "Trà vải hạt sen vàng",          price: 32000, ings: ["tra_dao", "vai_thieu", "hat_sen", "da_vien"], cat: "tra_trai_cay", desc: "Vải ngọt mọng nước cùng hạt sen bùi bùi" },
  { id: "tra_vai_da",     n: "Trà vải tuyết nhiệt đới",      price: 26000, ings: ["tra_dao", "vai_thieu", "da_vien"], cat: "tra_trai_cay", desc: "Thanh ngọt tự nhiên, giải nhiệt ngày hè" },
  { id: "tra_sen_vang",   n: "Trà hạt sen vàng thanh lọc",   price: 28000, ings: ["tra_dao", "hat_sen", "da_vien"], cat: "tra_trai_cay", desc: "Vị trà êm dịu cùng hạt sen hầm mềm" },
  { id: "tra_sen_macchi", n: "Trà sen vàng Macchiato",       price: 36000, ings: ["tra_dao", "hat_sen", "kem_muoi", "da_vien"], cat: "tra_trai_cay", desc: "Lớp bọt kem muối sánh mịn trên trà sen" },
  { id: "tra_bac_ha_da",  n: "Trà bạc hà chanh đá",          price: 22000, ings: ["tra_dao", "bac_ha", "chanh", "da_vien"], cat: "tra_trai_cay", desc: "Chua nhẹ the mát tức thì" },
  { id: "tra_cam_sa_da",  n: "Trà cam sả đường phèn",         price: 25000, ings: ["tra_dao", "cam_sa", "duong_phen", "da_vien"], cat: "tra_trai_cay", desc: "Vị ngọt dịu thơm nức hương sả" },
  { id: "tra_sua_chua_tc",n: "Trà sữa chua dải đá tuyết",    price: 28000, ings: ["tra_dao", "sua_chua", "da_vien"], cat: "tra_trai_cay", desc: "Vị trà kết hợp sữa chua thanh khiết" },
  { id: "tra_dao_kem_muoi",n: "Trà đào kem muối Macchiato",   price: 30000, ings: ["tra_dao", "kem_muoi", "da_vien"], cat: "tra_trai_cay", desc: "Kem muối mằn mặn trên nền trà đào ngọt ngào" },

  // 4. TRÀ SỮA & MACCHIATO BÉO NGẬY (8 món)
  { id: "ts_truyen_thong",n: "Trà sữa trân châu truyền thống",price: 30000, ings: ["tra_dao", "sua_dac", "tran_chau", "da_vien"], cat: "tra_sua", desc: "Đậm vị trà, thơm vị sữa cùng trân châu dẻo" },
  { id: "ts_tuoi_tc",     n: "Trà sữa tươi trân châu",       price: 32000, ings: ["tra_dao", "sua_tuoi", "tran_chau", "da_vien"], cat: "tra_sua", desc: "Thanh nhẹ, béo ngọt sữa tươi thượng hạng" },
  { id: "ts_kem_muoi",    n: "Trà sữa kem muối nướng",       price: 32000, ings: ["tra_dao", "sua_dac", "kem_muoi", "da_vien"], cat: "tra_sua", desc: "Béo ngậy thơm nức lòng giới trẻ" },
  { id: "ts_kem_trung",   n: "Trà sữa kem trứng dẻo",        price: 35000, ings: ["tra_dao", "sua_dac", "kem_trung", "da_vien"], cat: "tra_sua", desc: "Lớp sốt kem trứng béo đặc sánh" },
  { id: "ts_cot_dua",     n: "Trà sữa cốt dừa Bến Tre",      price: 32000, ings: ["tra_dao", "nuoc_dua", "sua_dac", "da_vien"], cat: "tra_sua", desc: "Thơm nức mùi dừa tự nhiên béo ngậy" },
  { id: "sua_tuoi_dp_tc", n: "Sữa tươi trân châu đường phèn", price: 30000, ings: ["sua_tuoi", "tran_chau", "duong_phen", "da_vien"], cat: "tra_sua", desc: "Vị ngọt thanh tao cùng trân châu dai giòn" },
  { id: "ts_sen_vang",    n: "Trà sữa hạt sen thơm bùi",     price: 32000, ings: ["tra_dao", "sua_dac", "hat_sen", "da_vien"], cat: "tra_sua", desc: "Sự kết hợp tinh tế giữa trà sữa và sen vàng" },
  { id: "ts_bac_ha",      n: "Trà sữa bạc hà the mát",       price: 28000, ings: ["tra_dao", "sua_dac", "bac_ha", "da_vien"], cat: "tra_sua", desc: "Vừa béo vừa mát lạnh sảng khoái" },

  // 5. MATCHA & CACAO NGUYÊN CHẤT (11 món)
  { id: "matcha_latte",   n: "Matcha Latte Nhật Bản đá",     price: 30000, ings: ["matcha", "sua_tuoi", "da_vien"], cat: "matcha_cacao", desc: "Hương vị trà xanh nguyên chất đậm đà" },
  { id: "matcha_nong",    n: "Matcha Latte nóng ấm",         price: 30000, ings: ["matcha", "sua_tuoi"], cat: "matcha_cacao", desc: "Ấm lòng ngày se lạnh với bọt sữa mịn" },
  { id: "matcha_kem_muoi",n: "Matcha Macchiato kem muối",    price: 35000, ings: ["matcha", "sua_tuoi", "kem_muoi", "da_vien"], cat: "matcha_cacao", desc: "Vị chát nhẹ của matcha quyện cùng kem muối" },
  { id: "matcha_kem_trung",n: "Matcha kem trứng béo ngậy",   price: 36000, ings: ["matcha", "sua_tuoi", "kem_trung", "da_vien"], cat: "matcha_cacao", desc: "Sự kết hợp hoàn hảo giữa trà xanh và trứng" },
  { id: "matcha_cot_dua", n: "Matcha cốt dừa non",           price: 35000, ings: ["matcha", "nuoc_dua", "sua_dac", "da_vien"], cat: "matcha_cacao", desc: "Thơm lừng nước cốt dừa ngậy béo" },
  { id: "matcha_tc",      n: "Matcha trân châu đường phèn",  price: 35000, ings: ["matcha", "sua_tuoi", "tran_chau", "da_vien"], cat: "matcha_cacao", desc: "Topping trân châu dai dai cùng matcha thơm" },
  { id: "cacao_da",       n: "Cacao dầm đá tuyết",           price: 25000, ings: ["cacao", "sua_dac", "da_vien"], cat: "matcha_cacao", desc: "Món quà tuổi thơ của giới học sinh, sinh viên" },
  { id: "cacao_nong",     n: "Cacao nóng béo đậm đà",        price: 25000, ings: ["cacao", "sua_dac"], cat: "matcha_cacao", desc: "Thơm nồng ấm áp xua tan mệt mỏi" },
  { id: "cacao_kem_muoi", n: "Cacao Macchiato kem muối",     price: 32000, ings: ["cacao", "sua_tuoi", "kem_muoi", "da_vien"], cat: "matcha_cacao", desc: "Đắng dịu hòa tan cùng lớp kem muối béo" },
  { id: "cacao_kem_trung",n: "Cacao kem trứng phố cổ",       price: 35000, ings: ["cacao", "sua_dac", "kem_trung", "da_vien"], cat: "matcha_cacao", desc: "Hương vị nức tiếng thơm lừng béo ngậy" },
  { id: "cacao_bac_ha",   n: "Cacao bạc hà tuyết lạnh",      price: 32000, ings: ["cacao", "sua_tuoi", "bac_ha", "da_vien"], cat: "matcha_cacao", desc: "Hương vị sô-cô-la bạc hà sang trọng" },

  // 6. MÓN ĂN KÈM VỈA HÈ (3 món)
  { id: "dia_huong_duong",n: "Đĩa Hướng dương rang củi",     price: 12000, ings: ["huong_duong"], cat: "an_kem", desc: "Món nhâm nhi bất hủ trong câu chuyện bạn bè" },
  { id: "banh_croissant", n: "Bánh sừng bò Croissant bơ",     price: 25000, ings: ["croissant"], cat: "an_kem", desc: "Vỏ ngàn lớp giòn tan thơm lừng mùi bơ" },
  { id: "banh_chuoi_nuong",n: "Bánh chuối nướng cốt dừa",    price: 18000, ings: ["banh_chuoi"], cat: "an_kem", desc: "Món bánh dân dã thơm nức góc phố vỉa hè" }
];

const MENU_CATEGORIES = [
  { id: "all",           n: "Tất cả (48)" },
  { id: "cafe_phin",     n: "Cà phê phin (8)" },
  { id: "cafe_dac_san",  n: "Cà phê đặc sản (8)" },
  { id: "tra_trai_cay",  n: "Trà trái cây (10)" },
  { id: "tra_sua",       n: "Trà sữa (8)" },
  { id: "matcha_cacao",  n: "Matcha & Cacao (11)" },
  { id: "an_kem",        n: "Ăn vặt (3)" }
];

const REVIEW_COMMENTS_5 = [
  "Cà phê muối béo ngậy đỉnh nóc kịch trần, đúng gu mình luôn!",
  "Quán vỉa hè mà pha chế chuyên nghiệp 5 sao, ly nước rất đẹp!",
  "Bạc xỉu 3 tầng uống ngon xỉu, nhạc Lo-Fi chill hết nấc.",
  "Chủ quán thân thiện, làm nhanh thoăn thoắt không phải đợi lâu.",
  "Trà đào cam sả thơm phức, cắn miếng đào ngập miệng giòn rụm!",
  "Góc vỉa hè ngồi ngắm xe cộ chill đỉnh cao, chắc chắn quay lại!",
  "Matcha kem trứng béo ngậy chuẩn vị, 10 điểm không có nhưng!",
  "Cacao dầm đá tuổi thơ ăn kèm bánh sừng bò ngon nhức nách!",
  "Trà sen vàng macchiato lớp bọt béo mịn, uống một ngụm là mê!",
  "Quán ruột của mình mỗi sáng, không uống là nhớ cồn cào!"
];

const REVIEW_COMMENTS_4 = [
  "Nước uống ngon vừa miệng, lúc quán đông thì đợi thêm tí nhưng xứng đáng.",
  "Cà phê đậm vị, giá cả vỉa hè rất phải chăng cho sinh viên.",
  "Không gian thoáng đãng, bàn ghế ngồi thoải mái ngắm phố.",
  "Uống rất vừa vị, lần sau sẽ rủ bạn bè ghé ủng hộ quán tiếp.",
  "Nhân viên và chủ quán vui vẻ, phục vụ nhanh nhẹn dễ mến.",
  "Bánh chuối nướng thơm phức béo béo, chấm điểm 8/10."
];

const REVIEW_COMMENTS_3 = [
  "Nước uống tạm ổn nhưng quán làm hơi lâu xíu, cần nhanh tay hơn.",
  "Hơi ngọt một chút so với khẩu vị của mình, mong quán bớt ngọt.",
  "Quán hơi ồn ào lúc giờ cao điểm, nhưng nước uống thì được.",
  "Vỉa hè hơi chật lúc trật tự đi tuần, nhưng thông cảm được."
];

const REVIEW_COMMENTS_BAD = [
  "Chờ hơn 15 phút không thấy bưng ra, quá thất vọng bỏ về luôn!",
  "Phục vụ chậm quá mức, khách ngồi mỏi mòn chẳng thấy ly nước đâu.",
  "Quán làm quá lâu, làm lỡ cả giờ hẹn của tôi, 1 sao!",
  "Đợi nước đến mức rụng nụ luôn mà chưa thấy ly cà phê đâu cả!"
];

const ANIME_CUSTOMERS = [
  { name: "Khả Ngân", img: "images/avatar_kha_ngan.jpg" },
  { name: "Hoàng Bách", img: "images/avatar_hoang_bach.jpg" },
  { name: "Minh Thư", img: "images/avatar_minh_thu.jpg" },
  { name: "Tuấn Anh", img: "images/avatar_tuan_anh.jpg" },
  { name: "Ngọc Diệp", img: "images/avatar_ngoc_diep.jpg" },
  { name: "Thanh Trúc", img: "images/avatar_thanh_truc.jpg" },
  { name: "Anh Đức", img: "images/avatar_anh_duc.jpg" },
  { name: "Cô Hà", img: "images/avatar_co_ha.jpg" },
  { name: "Chú Ba", img: "images/avatar_chu_ba.jpg" },
  { name: "Bác Năm", img: "images/avatar_chu_ba.jpg" },
  { name: "Bảo Ngọc", img: "images/avatar_kha_ngan.jpg" },
  { name: "Quang Huy", img: "images/avatar_tuan_anh.jpg" },
  { name: "Phương Linh", img: "images/avatar_minh_thu.jpg" },
  { name: "Duy Khoa", img: "images/avatar_hoang_bach.jpg" },
  { name: "Thảo My", img: "images/avatar_thanh_truc.jpg" },
  { name: "Hải Đăng", img: "images/avatar_anh_duc.jpg" },
  { name: "Chị Mai", img: "images/avatar_co_ha.jpg" },
  { name: "Trọng Hiếu", img: "images/avatar_hoang_bach.jpg" },
  { name: "Thùy Trang", img: "images/avatar_ngoc_diep.jpg" },
  { name: "Văn Hùng", img: "images/avatar_tuan_anh.jpg" }
];

class GameEngine {
  constructor() {
    this.day = 1;
    this.hour = 7;
    this.minute = 0;
    this.money = 65000;
    this.debt = 0;
    this.debtBank = 0;
    this.debtPersonal = 0;
    this.penalizedForLowRating = false;
    this.dayElapsedSeconds = 0;
    this.dailyServed = 0;
    this.dailyRevenue = 0;
    this.totalStars = 86;
    this.reviews = 18;
    this.rating = 4.8;
    this.shopName = "HBcoffee";
    this.shopRank = "TIỆM NHỎ";
    this.paused = false;
    this.allMenuUnlocked = false;
    this.lastDramaTime = Date.now();
    this.nextDramaDelay = this.getRandomDramaDelay(); // 2 đến 3 phút (120s - 180s)

    // Tiến trình riêng cho từng client / người chơi (Requirement 3: không chơi đè nhau)
    this.clientId = this.getOrCreateClientId();
    const urlParams = new URLSearchParams(window.location.search);
    this.profileId = urlParams.get("player") || localStorage.getItem("hbcoffee_active_player") || "default";
    this.saveKey = `hbcoffee_save_${this.clientId}_${this.profileId}`;

    this.reviewList = [
      { name: "Khả Ngân", img: "images/avatar_kha_ngan.jpg", stars: 5, drink: "Cà phê muối béo ngậy xứ Huế", comment: "Cà phê muối đỉnh cao, lớp kem sánh mịn thơm lừng!", time: "Vừa xong" },
      { name: "Hoàng Bách", img: "images/avatar_hoang_bach.jpg", stars: 5, drink: "Bạc xỉu 3 tầng đá", comment: "Bạc xỉu chuẩn 3 tầng đẹp mắt, nhạc Lo-Fi chill quá chừng.", time: "5 phút trước" },
      { name: "Thanh Trúc", img: "images/avatar_thanh_truc.jpg", stars: 5, drink: "Matcha Latte Nhật Bản đá", comment: "Vừa uống matcha vừa vẽ tranh ở góc vỉa hè siêu thơ mộng!", time: "8 phút trước" },
      { name: "Anh Đức", img: "images/avatar_anh_duc.jpg", stars: 5, drink: "Cà phê đen đá", comment: "Đen đá đậm đặc cứu mạng coder thức đêm fix bug!", time: "15 phút trước" },
      { name: "Cô Hà", img: "images/avatar_co_ha.jpg", stars: 5, drink: "Trà hạt sen vàng thanh lọc", comment: "Trà hạt sen ngọt mát thanh lọc, cô Hà ưng cái bụng lắm.", time: "22 phút trước" },
      { name: "Minh Thư", img: "images/avatar_minh_thu.jpg", stars: 4, drink: "Trà đào cam sả thanh mát", comment: "Trà thơm đào giòn, quán đông khách nên chờ một tẹo.", time: "30 phút trước" },
      { name: "Tuấn Anh", img: "images/avatar_tuan_anh.jpg", stars: 5, drink: "Cà phê trứng Hà Nội", comment: "Kem trứng bông mịn đặc sản phố cổ, ngon hết nấc!", time: "1 giờ trước" },
      { name: "Ngọc Diệp", img: "images/avatar_ngoc_diep.jpg", stars: 5, drink: "Trà vải tuyết nhiệt đới", comment: "Trà vải ngọt thanh tự nhiên, ngồi đọc sách cả buổi rất thích.", time: "Hôm qua" }
    ];

    // Upgrades
    this.upgrades = {
      fan: false,    // Quạt mát: +30% kiên nhẫn
      wifi: false,   // Wi-Fi: +20% kiên nhẫn
      chair: false,  // Ghế cóc xịn: mở thêm bàn thứ 3 và 4
      sign: false    // Biển neon: khách đến nhanh hơn
    };

    // Inventory
    this.stock = {};
    for (let k in ITEMS) {
      this.stock[k] = ITEMS[k].unlock === 0 ? 8 : 0;
    }

    // Seating
    this.seats = [
      { id: 0, customer: null },
      { id: 1, customer: null },
      { id: 2, customer: null, locked: true },
      { id: 3, customer: null, locked: true }
    ];

    // Current brew in progress
    this.currentCup = [];

    this.loadSave();
    this.initDOM();
    this.bindEvents();
    this.startLoop();
  }

  getOrCreateClientId() {
    let cid = localStorage.getItem("hbcoffee_client_uuid");
    if (!cid) {
      cid = "c_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 6);
      localStorage.setItem("hbcoffee_client_uuid", cid);
    }
    return cid;
  }

  loadSave() {
    try {
      let data = localStorage.getItem(this.saveKey);
      if (!data && this.profileId === "default") {
        data = localStorage.getItem("tiem_ca_phe_save");
      }
      if (data) {
        const s = JSON.parse(data);
        this.day = s.day || 1;
        this.dayElapsedSeconds = s.dayElapsedSeconds || 0;
        this.money = typeof s.money === "number" ? s.money : 65000;
        this.debtBank = typeof s.debtBank === "number" ? s.debtBank : 0;
        this.debtPersonal = typeof s.debtPersonal === "number" ? s.debtPersonal : 0;
        if (typeof s.debt === "number" && s.debt > 0 && this.debtBank === 0 && this.debtPersonal === 0) {
          this.debtBank = s.debt; // backwards compatibility
        }
        this.debt = (this.debtBank || 0) + (this.debtPersonal || 0);
        this.penalizedForLowRating = s.penalizedForLowRating || false;
        this.reviews = s.reviews || 18;
        this.totalStars = s.totalStars || Math.round((s.rating || 4.8) * this.reviews);
        this.rating = Number((this.totalStars / this.reviews).toFixed(1));
        this.shopName = (s.shopName && s.shopName !== "Henho") ? s.shopName : "HBcoffee";
        this.shopRank = s.shopRank || "TIỆM NHỎ";
        this.allMenuUnlocked = s.allMenuUnlocked || false;
        this.dailyServed = s.dailyServed || 0;
        this.dailyRevenue = s.dailyRevenue || 0;
        if (s.reviewList && Array.isArray(s.reviewList)) this.reviewList = s.reviewList;
        if (s.stock) this.stock = Object.assign(this.stock, s.stock);
        if (s.upgrades) {
          this.upgrades = s.upgrades;
          if (this.upgrades.chair) {
            this.seats[2].locked = false;
            this.seats[3].locked = false;
          }
        }
      }
    } catch (e) {}
  }

  save() {
    try {
      localStorage.setItem(this.saveKey, JSON.stringify({
        day: this.day,
        dayElapsedSeconds: this.dayElapsedSeconds || 0,
        money: this.money,
        debt: this.debt || 0,
        debtBank: this.debtBank || 0,
        debtPersonal: this.debtPersonal || 0,
        penalizedForLowRating: this.penalizedForLowRating || false,
        totalStars: this.totalStars,
        rating: this.rating,
        reviews: this.reviews,
        reviewList: this.reviewList,
        shopName: this.shopName,
        shopRank: this.shopRank,
        allMenuUnlocked: this.allMenuUnlocked,
        stock: this.stock,
        upgrades: this.upgrades,
        dailyServed: this.dailyServed || 0,
        dailyRevenue: this.dailyRevenue || 0
      }));
    } catch (e) {}
  }

  unlockAllMenu() {
    this.allMenuUnlocked = true;
    for (let k in ITEMS) {
      if ((this.stock[k] || 0) < 10) {
        this.stock[k] = 10;
      }
    }
    snd.playServeSuccess();
    snd.playCoin();
    this.showToast("🎉 ĐÃ MỞ KHÓA TOÀN BỘ 48 MÓN TRONG MENU!");
    this.renderTrays();
    this.renderHeader();
    this.save();
  }

  initDOM() {
    this.dom = {
      splash: document.getElementById("splash-screen"),
      splashMoney: document.getElementById("splash-money"),
      splashRank: document.getElementById("splash-rank"),
      btnEnterShop: document.getElementById("btn-enter-shop"),
      btnMusic: document.getElementById("btn-music"),
      btnFullscreen: document.getElementById("btn-fullscreen"),
      cornerMenuBtn: document.getElementById("btn-corner-menu"),
      hudReviewsBtn: document.getElementById("hud-reviews-btn"),
      day: document.getElementById("day-label"),
      time: document.getElementById("time-label"),
      money: document.getElementById("money-val"),
      stars: document.getElementById("stars-label"),
      reviews: document.getElementById("reviews-label"),
      boardName: document.getElementById("board-name"),
      boardRank: document.getElementById("board-rank"),
      seats: document.getElementById("seats-grid"),
      trays: document.getElementById("trays-grid"),
      cupIcon: document.getElementById("cup-icon"),
      cupTitle: document.getElementById("cup-drink-title"),
      cupList: document.getElementById("cup-items-list"),
      cupLayerMilk: document.getElementById("cup-layer-milk"),
      cupLayerCoffee: document.getElementById("cup-layer-coffee"),
      cupLayerFoam: document.getElementById("cup-layer-foam"),
      ice1: document.getElementById("ice-1"),
      ice2: document.getElementById("ice-2"),
      btnServe: document.getElementById("btn-serve"),
      btnClear: document.getElementById("btn-clear"),
      modal: document.getElementById("modal"),
      card: document.getElementById("card"),
      toast: document.getElementById("toast")
    };
    this.renderHeader();
    this.renderSeats();
    this.renderTrays();
    this.renderCup();
  }

  formatMoney(val) {
    const isNeg = val < 0;
    const absM = Math.abs(val);
    let txt = "";
    if (absM >= 1000000) {
      txt = (absM / 1000000).toFixed(1).replace(".", ",") + "tr";
    } else if (absM >= 1000) {
      txt = (absM / 1000).toFixed(1).replace(".", ",").replace(",0", "") + "k";
    } else {
      txt = absM + "đ";
    }
    return (isNeg ? "-" : "") + txt;
  }

  renderHeader() {
    this.dom.day.textContent = `Ngày ${this.day}`;
    const h = String(this.hour).padStart(2, '0');
    const m = String(this.minute).padStart(2, '0');
    
    // Đếm ngược 5 phút (300 giây) cho 1 ngày kinh doanh (Requirement 4)
    const remSec = Math.max(0, 300 - Math.floor(this.dayElapsedSeconds || 0));
    const remMin = Math.floor(remSec / 60);
    const remS = remSec % 60;
    this.dom.time.textContent = `${h}:${m} (${remMin}p${remS < 10 ? '0' : ''}${remS}s)`;
    
    // Thanh tiến trình 5 phút chạy mượt trên đỉnh HUD
    const dayProgress = Math.min(1, (this.dayElapsedSeconds || 0) / 300);
    const progressBar = document.getElementById("day-progress-bar");
    if (progressBar) {
      progressBar.style.width = (dayProgress * 100) + "%";
    }

    // Tiền trong két (Hỗ trợ hiển thị số âm khi bị phạt hoặc nợ tiền)
    const moneyText = this.formatMoney(this.money);
    this.dom.money.textContent = moneyText;
    if (this.money < 0) {
      this.dom.money.style.color = "#FF4D4D";
      this.dom.money.style.textShadow = "0 0 10px rgba(255, 77, 77, 0.5)";
    } else {
      this.dom.money.style.color = "";
      this.dom.money.style.textShadow = "";
    }

    if (this.dom.splashMoney) {
      this.dom.splashMoney.textContent = moneyText;
      this.dom.splashMoney.style.color = this.money < 0 ? "#FF4D4D" : "";
    }
    if (this.dom.splashRank) this.dom.splashRank.textContent = this.shopRank;
    const splashStars = document.getElementById("splash-stars");
    if (splashStars) splashStars.textContent = `${this.rating.toFixed(1).replace(".", ",")} ⭐`;

    // Dynamic stars computation
    const fullStars = Math.min(5, Math.max(1, Math.round(this.rating)));
    const starStr = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
    this.dom.stars.textContent = starStr;
    this.dom.reviews.textContent = `${this.rating.toFixed(1).replace(".", ",")} • ${this.reviews} đánh giá ↗`;
    this.dom.boardName.textContent = this.shopName;
    this.dom.boardRank.textContent = this.shopRank;

    // Tự động kiểm tra phạt nếu đánh giá tụt xuống dưới 1.5 sao (Requirement 2)
    this.checkRatingPenalty();
  }

  // PHẠT 300K KHI ĐÁNH GIÁ DƯỚI 1.5 SAO (CHO PHÉP SỐ ÂM)
  checkRatingPenalty() {
    if (this.rating < 1.5 && !this.penalizedForLowRating) {
      this.penalizedForLowRating = true;
      const fine = 300000;
      this.money -= fine; // Bị phạt 300k, nếu không đủ tiền thì tính theo số âm
      snd.playServeFail();
      this.showToast(`🚨 Quán bị phạt -300k do đánh giá dưới 1.5⭐ (${this.rating.toFixed(1)}⭐)!`);

      this.showModal({
        content: `
          <div style="text-align:center;padding:6px;">
            <div style="font-size:46px;margin-bottom:6px;">🚨</div>
            <h3 style="font-family:var(--fd);font-size:18px;color:var(--bad);margin-bottom:6px;">QUÁN BỊ PHẠT 300.000đ!</h3>
            <p style="font-size:12.5px;color:var(--ink);line-height:1.5;margin-bottom:10px;">
              Điểm đánh giá của quán đã rơi xuống mức báo động <b>${this.rating.toFixed(1)} ⭐ (&lt; 1.5 sao)</b>!<br>
              Đội Quản lý Vệ sinh & Đô thị đã lập biên bản xử phạt <b>-300.000đ</b> vì dịch vụ không đạt yêu cầu.
            </p>
            <div style="background:#FFF0F0;border:1.5px dashed var(--bad);border-radius:12px;padding:10px;margin-bottom:12px;">
              <div style="font-size:11.5px;color:var(--ink2);">Số dư tài khoản sau khi trừ phạt:</div>
              <div style="font-size:22px;font-weight:800;color:${this.money < 0 ? 'var(--bad)' : 'var(--leaf)'};margin-top:2px;">
                ${this.formatMoney(this.money)}
              </div>
              ${this.money < 0 ? `<div style="font-size:11px;color:var(--bad);font-weight:700;margin-top:2px;">(Tài khoản đang bị âm tiền!)</div>` : ''}
              <small style="font-size:10.5px;color:#777;display:block;margin-top:4px;">
                *Đừng lo lắng, bạn có thể vay vốn kinh doanh từ Ngân Hàng (VCB +0.05%) hoặc Cá Nhân (VCB +1.25%) để nhập hàng và buôn bán gỡ lại sao!
              </small>
            </div>
          </div>
        `,
        choices: [
          {
            t: "🏛 Vay Ngân Hàng VCB (+100k - Lãi +0.05%)",
            fn: () => {
              this.borrowLoan(100000, 'bank');
              this.paused = false;
              this.renderHeader();
            }
          },
          {
            t: "🤝 Vay Cá Nhân Vỉa Hè (+100k - Lãi +1.25%)",
            fn: () => {
              this.borrowLoan(100000, 'personal');
              this.paused = false;
              this.renderHeader();
            }
          },
          {
            t: "Đã hiểu, cố gắng phục vụ tốt hơn",
            fn: () => {
              this.paused = false;
              this.renderHeader();
            }
          }
        ]
      });
      this.renderHeader();
      this.save();
    } else if (this.rating >= 1.5) {
      // Khi đã nỗ lực kéo rating lên lại trên 1.5 sao, reset cờ phạt để nếu sau này rơi lại sẽ phạt tiếp
      this.penalizedForLowRating = false;
    }
  }

  // HỆ THỐNG VAY VỐN KINH DOANH (NGÂN HÀNG VCB + 0.05% HOẶC CÁ NHÂN VCB + 1.25%)
  borrowLoan(amount, provider = 'bank') {
    this.money += amount;
    if (provider === 'personal') {
      this.debtPersonal = (this.debtPersonal || 0) + amount;
    } else {
      this.debtBank = (this.debtBank || 0) + amount;
    }
    this.debt = (this.debtBank || 0) + (this.debtPersonal || 0);
    snd.playCoin();
    if (provider === 'personal') {
      this.showToast(`🤝 Đã vay Cá Nhân (lãi VCB + 1.25%): +${(amount/1000)}k vốn!`);
    } else {
      this.showToast(`🏛 Đã giải ngân Ngân Hàng VCB (lãi VCB + 0.05%): +${(amount/1000)}k vốn!`);
    }
    this.renderHeader();
    this.save();
  }

  repayLoan(amount, provider = 'all') {
    if (this.money <= 0) {
      this.showToast("Không đủ tiền dương trong két để trả nợ!");
      return;
    }
    let actualRepaid = 0;
    if (provider === 'personal') {
      const canPay = Math.min(amount, this.debtPersonal || 0, Math.max(0, this.money));
      if (canPay <= 0) {
        this.showToast("Bạn không có nợ Cá Nhân hoặc két không đủ tiền!");
        return;
      }
      this.money -= canPay;
      this.debtPersonal = Math.max(0, (this.debtPersonal || 0) - canPay);
      actualRepaid = canPay;
    } else if (provider === 'bank') {
      const canPay = Math.min(amount, this.debtBank || 0, Math.max(0, this.money));
      if (canPay <= 0) {
        this.showToast("Bạn không có nợ Ngân Hàng hoặc két không đủ tiền!");
        return;
      }
      this.money -= canPay;
      this.debtBank = Math.max(0, (this.debtBank || 0) - canPay);
      actualRepaid = canPay;
    } else {
      // provider === 'all': Ưu tiên trả nợ cá nhân lãi cao (+1.25%) trước, sau đó trả nợ ngân hàng
      let remain = Math.min(amount, this.debt || 0, Math.max(0, this.money));
      if (remain <= 0) {
        this.showToast("Bạn không có khoản nợ nào cần trả!");
        return;
      }
      actualRepaid = remain;
      this.money -= remain;
      if ((this.debtPersonal || 0) > 0) {
        const payPers = Math.min(this.debtPersonal, remain);
        this.debtPersonal -= payPers;
        remain -= payPers;
      }
      if (remain > 0 && (this.debtBank || 0) > 0) {
        const payBank = Math.min(this.debtBank, remain);
        this.debtBank -= payBank;
        remain -= payBank;
      }
    }

    this.debt = (this.debtBank || 0) + (this.debtPersonal || 0);
    snd.playCoin();
    this.showToast(`Đã trả nợ ${(actualRepaid/1000)}k thành công! Còn nợ: ${(this.debt/1000)}k`);
    this.renderHeader();
    this.save();
  }

  openLoanModal() {
    this.paused = true;
    snd.playClick();

    const vcbRate = VCB_BASE_RATE; // 4.8%
    const bankRate = Number((vcbRate + 0.05).toFixed(2)); // 4.85%
    const personalRate = Number((vcbRate + 1.25).toFixed(2)); // 6.05%

    const bankDailyEst = Math.round((this.debtBank || 0) * (bankRate / 100));
    const persDailyEst = Math.round((this.debtPersonal || 0) * (personalRate / 100));

    this.showModal({
      content: `
        <div style="text-align:left;padding:2px;">
          <h3 style="font-family:var(--fd);font-size:17px;color:var(--ink);margin-bottom:4px;display:flex;align-items:center;gap:6px;">
            <span>🏛</span> <span>Quỹ Vay Vốn Kinh Doanh HBcoffee</span>
          </h3>
          <p style="font-size:11.5px;color:var(--ink2);margin-bottom:10px;">
            Cung cấp nguồn vốn lưu động khi thiếu tiền nhập hàng hoặc mở rộng quy mô tiệm cà phê.
          </p>

          <!-- BANNER THAM CHIẾU LÃI SUẤT VIETCOMBANK (VCB) -->
          <div class="loan-rate-banner">
            <span class="vcb-logo-tag">VCB RATE</span>
            <div>
              <b>Lãi suất tham chiếu Vietcombank:</b> <b>${vcbRate}%/kỳ</b><br>
              <span style="font-size:10.5px;opacity:0.9;">Mọi khoản vay được tính minh bạch dựa trên lãi suất cơ sở của Vietcombank.</span>
            </div>
          </div>
          
          <!-- THÔNG SỐ TÀI CHÍNH HIỆN TẠI -->
          <div style="background:#F9F4F2;border-radius:12px;padding:10px 12px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;border:1px solid #E8DFDA;">
            <div>
              <div style="font-size:11px;color:var(--ink2);">Số dư két hiện tại:</div>
              <b style="font-size:16px;color:${this.money < 0 ? 'var(--bad)' : 'var(--leaf)'};">${this.formatMoney(this.money)}</b>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;color:var(--ink2);">Tổng dư nợ đang vay:</div>
              <b style="font-size:16px;color:var(--bad);">${(this.debt || 0) > 0 ? this.formatMoney(this.debt) : '0đ (Không nợ)'}</b>
            </div>
          </div>

          <!-- 2 NGUỒN CUNG CẤP VỐN: NGÂN HÀNG & CÁ NHÂN -->
          <div class="loan-providers-container">
            <!-- NGUỒN 1: NGÂN HÀNG (VIETCOMBANK) -->
            <div class="loan-provider-card bank">
              <div class="loan-card-top">
                <div class="loan-card-name">
                  <span>🏛</span>
                  <span>Ngân Hàng (Vietcombank)</span>
                </div>
                <span class="loan-rate-badge bank">Lãi: VCB + 0.05% (${bankRate}%)</span>
              </div>
              <div class="loan-card-desc">
                Khoản vay kinh doanh chính thống từ Vietcombank. Lãi suất ưu đãi cực thấp, thích hợp vay trung và dài hạn.
              </div>
              <div class="loan-debt-status">
                <span>Dư nợ VCB: <b style="color:${(this.debtBank||0)>0 ? 'var(--bad)' : '#059669'};">${this.formatMoney(this.debtBank || 0)}</b></span>
                <span style="font-size:10.5px;color:#666;">(Lãi dự tính: ${this.formatMoney(bankDailyEst)}/ngày)</span>
              </div>
              <div style="font-size:11px;font-weight:700;color:var(--ink);margin-bottom:6px;">Chọn gói giải ngân Ngân Hàng:</div>
              <div class="loan-btn-grid">
                <button class="loan-btn-action bank loan-borrow-btn" data-amt="50000" data-prov="bank">+50k</button>
                <button class="loan-btn-action bank loan-borrow-btn" data-amt="100000" data-prov="bank">+100k</button>
                <button class="loan-btn-action bank loan-borrow-btn" data-amt="200000" data-prov="bank">+200k</button>
                <button class="loan-btn-action bank loan-borrow-btn" data-amt="500000" data-prov="bank">+500k</button>
              </div>
              ${(this.debtBank || 0) > 0 && this.money > 0 ? `
                <div class="loan-repay-row">
                  <span style="font-size:11px;color:var(--ink);">Trả nợ Vietcombank:</span>
                  <div style="display:flex;gap:4px;">
                    <button class="loan-repay-btn loan-repay-spec" data-amt="50000" data-prov="bank">Trả 50k</button>
                    <button class="loan-repay-btn loan-repay-spec" data-amt="${this.debtBank}" data-prov="bank">Trả Hết (${(this.debtBank/1000)}k)</button>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- NGUỒN 2: CÁ NHÂN (VỐN TƯ NHÂN VỈA HÈ) -->
            <div class="loan-provider-card personal">
              <div class="loan-card-top">
                <div class="loan-card-name">
                  <span>🤝</span>
                  <span>Khoản Vay Cá Nhân</span>
                </div>
                <span class="loan-rate-badge personal">Lãi: VCB + 1.25% (${personalRate}%)</span>
              </div>
              <div class="loan-card-desc">
                Vốn tư nhân từ đối tác quen biết vỉa hè. Thủ tục giải ngân tức thì, lãi suất cao hơn +1.25%.
              </div>
              <div class="loan-debt-status">
                <span>Dư nợ Cá Nhân: <b style="color:${(this.debtPersonal||0)>0 ? 'var(--bad)' : '#D97706'};">${this.formatMoney(this.debtPersonal || 0)}</b></span>
                <span style="font-size:10.5px;color:#666;">(Lãi dự tính: ${this.formatMoney(persDailyEst)}/ngày)</span>
              </div>
              <div style="font-size:11px;font-weight:700;color:var(--ink);margin-bottom:6px;">Chọn gói giải ngân Cá Nhân:</div>
              <div class="loan-btn-grid">
                <button class="loan-btn-action personal loan-borrow-btn" data-amt="50000" data-prov="personal">+50k</button>
                <button class="loan-btn-action personal loan-borrow-btn" data-amt="100000" data-prov="personal">+100k</button>
                <button class="loan-btn-action personal loan-borrow-btn" data-amt="200000" data-prov="personal">+200k</button>
                <button class="loan-btn-action personal loan-borrow-btn" data-amt="500000" data-prov="personal">+500k</button>
              </div>
              ${(this.debtPersonal || 0) > 0 && this.money > 0 ? `
                <div class="loan-repay-row">
                  <span style="font-size:11px;color:var(--ink);">Trả nợ Cá Nhân (Ưu tiên):</span>
                  <div style="display:flex;gap:4px;">
                    <button class="loan-repay-btn loan-repay-spec" data-amt="50000" data-prov="personal" style="background:#B45309;">Trả 50k</button>
                    <button class="loan-repay-btn loan-repay-spec" data-amt="${this.debtPersonal}" data-prov="personal" style="background:#B45309;">Trả Hết (${(this.debtPersonal/1000)}k)</button>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- NÚT TRẢ TOÀN BỘ NỢ NHANH -->
          ${(this.debt || 0) > 0 && this.money > 0 ? `
            <div style="border-top:1px dashed #ddd;padding-top:10px;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:11.5px;font-weight:700;color:var(--ink);">Thanh toán nhanh toàn bộ:</span>
              <button id="btn-repay-all" class="loan-repay-btn all" style="padding:7px 14px;font-size:12px;">Trả Tất Cả Nợ (${this.formatMoney(Math.min(this.debt, this.money))})</button>
            </div>
          ` : ''}
        </div>
      `,
      choices: [
        {
          t: "Đóng cửa sổ",
          fn: () => { this.paused = false; this.renderHeader(); }
        }
      ]
    });

    // Bind borrow clicks
    this.dom.card.querySelectorAll(".loan-borrow-btn").forEach(btn => {
      btn.onclick = () => {
        const amt = +btn.dataset.amt;
        const prov = btn.dataset.prov || 'bank';
        this.borrowLoan(amt, prov);
        this.openLoanModal();
      };
    });

    // Bind specific repay clicks
    this.dom.card.querySelectorAll(".loan-repay-spec").forEach(btn => {
      btn.onclick = () => {
        const amt = +btn.dataset.amt;
        const prov = btn.dataset.prov;
        this.repayLoan(amt, prov);
        this.openLoanModal();
      };
    });

    // Bind repay all
    const btnRepayAll = this.dom.card.querySelector("#btn-repay-all");
    if (btnRepayAll) {
      btnRepayAll.onclick = () => {
        this.repayLoan(this.debt, 'all');
        this.openLoanModal();
      };
    }
  }

  // HỒ SƠ NGƯỜI CHƠI (CLIENT & PROFILE RIÊNG BIỆT)
  openProfilesModal() {
    this.paused = true;
    snd.playClick();
    this.showModal({
      content: `
        <div style="text-align:left;padding:4px;">
          <h3 style="font-family:var(--fd);font-size:16px;color:var(--ink);margin-bottom:6px;">👤 Hồ Sơ Người Chơi (Tiến Trình Riêng)</h3>
          <p style="font-size:12px;color:var(--ink2);margin-bottom:10px;">
            Mỗi thiết bị/trình duyệt tự động có tiến trình độc lập. Bạn cũng có thể chọn hoặc tạo thêm hồ sơ để nhiều người chơi trên cùng một máy mà không đè save.
          </p>
          
          <div style="background:#F9F4F2;border-radius:12px;padding:10px;margin-bottom:12px;">
            <div style="font-size:11px;color:var(--ink2);">Hồ sơ hiện tại:</div>
            <b style="font-size:15px;color:var(--chili);">Tên hồ sơ: "${this.profileId}"</b>
            <div style="font-size:10.5px;color:#777;margin-top:2px;">Client ID: <code>${this.clientId}</code></div>
          </div>

          <div style="font-size:12px;font-weight:700;color:var(--ink);margin-bottom:6px;">Chuyển đổi nhanh hồ sơ:</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
            <button class="profile-switch-btn" data-pid="default" style="padding:6px 12px;border-radius:8px;border:1px solid #ccc;background:${this.profileId === 'default' ? 'var(--chili)' : '#fff'};color:${this.profileId === 'default' ? '#fff' : '#333'};font-weight:700;font-size:11.5px;cursor:pointer;">Hồ sơ Chính</button>
            <button class="profile-switch-btn" data-pid="player2" style="padding:6px 12px;border-radius:8px;border:1px solid #ccc;background:${this.profileId === 'player2' ? 'var(--chili)' : '#fff'};color:${this.profileId === 'player2' ? '#fff' : '#333'};font-weight:700;font-size:11.5px;cursor:pointer;">Người chơi 2</button>
            <button class="profile-switch-btn" data-pid="player3" style="padding:6px 12px;border-radius:8px;border:1px solid #ccc;background:${this.profileId === 'player3' ? 'var(--chili)' : '#fff'};color:${this.profileId === 'player3' ? '#fff' : '#333'};font-weight:700;font-size:11.5px;cursor:pointer;">Người chơi 3</button>
          </div>

          <div style="display:flex;gap:6px;">
            <input id="input-new-profile" type="text" placeholder="Tên hồ sơ mới..." style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid #ccc;font-size:12px;">
            <button id="btn-create-profile" style="background:var(--leaf);color:#fff;border:none;padding:8px 14px;border-radius:8px;font-weight:700;font-size:12px;cursor:pointer;">Tạo mới</button>
          </div>
        </div>
      `,
      choices: [
        {
          t: "Đóng",
          fn: () => { this.paused = false; }
        }
      ]
    });

    this.dom.card.querySelectorAll(".profile-switch-btn").forEach(btn => {
      btn.onclick = () => {
        const pid = btn.dataset.pid;
        localStorage.setItem("hbcoffee_active_player", pid);
        window.location.search = `?player=${encodeURIComponent(pid)}`;
      };
    });

    const btnCreate = this.dom.card.querySelector("#btn-create-profile");
    const inputProfile = this.dom.card.querySelector("#input-new-profile");
    if (btnCreate && inputProfile) {
      btnCreate.onclick = () => {
        const val = inputProfile.value.trim();
        if (!val) return;
        localStorage.setItem("hbcoffee_active_player", val);
        window.location.search = `?player=${encodeURIComponent(val)}`;
      };
    }
  }

  // KẾT THÚC NGÀY 5 PHÚT -> SANG NGÀY TIẾP THEO: DỌN DẸP (-25K), RESET KHO ĐỂ NHẬP TỪ ĐẦU
  endCurrentDay() {
    this.paused = true;
    snd.playServeSuccess();

    const prevDay = this.day;
    const cleaningFee = 25000;
    
    // Trừ phí lau dọn vệ sinh quán: -25k (tính âm nếu không đủ tiền)
    this.money -= cleaningFee;

    // Tính lãi suất vay kinh doanh phát sinh trong ngày:
    // Tham chiếu Vietcombank (VCB): 4.8%
    // Ngân hàng: VCB + 0.05% = 4.85%
    // Cá nhân: VCB + 1.25% = 6.05%
    const bankRate = Number((VCB_BASE_RATE + 0.05).toFixed(2));
    const personalRate = Number((VCB_BASE_RATE + 1.25).toFixed(2));
    
    const bankInterest = Math.round((this.debtBank || 0) * (bankRate / 100));
    const personalInterest = Math.round((this.debtPersonal || 0) * (personalRate / 100));
    const totalInterest = bankInterest + personalInterest;

    // Trừ tiền lãi vào két (tính âm nếu không đủ tiền)
    this.money -= totalInterest;
    
    // Bắt đầu ngày mới phải nhập nguyên liệu ngay từ đầu: kho dọn sạch về 0
    for (let k in this.stock) {
      this.stock[k] = 0;
    }

    const served = this.dailyServed || 0;
    const rev = this.dailyRevenue || 0;

    // Chuyển sang ngày tiếp theo
    this.day++;
    this.dayElapsedSeconds = 0;
    this.hour = 7;
    this.minute = 0;
    this.dailyServed = 0;
    this.dailyRevenue = 0;

    // Bàn ghế dọn sạch đón ngày mới
    this.seats.forEach(s => { s.customer = null; });

    this.renderHeader();
    this.renderSeats();
    this.renderTrays();
    this.renderCup();
    this.save();

    this.showModal({
      content: `
        <div style="text-align:center;padding:6px;">
          <div style="font-size:46px;margin-bottom:6px;">🌙</div>
          <h3 style="font-family:var(--fd);font-size:18px;color:var(--ink);margin-bottom:4px;">KẾT THÚC NGÀY ${prevDay}!</h3>
          <p style="font-size:12px;color:var(--ink2);margin-bottom:12px;">Đã hoàn thành ca làm việc 5 phút. Quán dọn dẹp sạch sẽ để chuẩn bị mở bán <b>Ngày ${this.day}</b>.</p>
          
          <div style="background:#F9F4F2;border-radius:12px;padding:12px;text-align:left;font-size:12.5px;margin-bottom:12px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;">
              <span>☕ Khách đã phục vụ hôm nay:</span> <b>${served} khách</b>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span>💰 Doanh thu bán cà phê:</span> <b style="color:var(--leaf);">+${this.formatMoney(rev)}</b>
            </div>
            <div style="display:flex;justify-content:space-between;border-top:1px dashed #ddd;padding-top:6px;">
              <span>🧹 Phí dọn dẹp vệ sinh quán:</span> <b style="color:var(--bad);">-25k (-25.000đ)</b>
            </div>
            ${bankInterest > 0 ? `
            <div style="display:flex;justify-content:space-between;">
              <span>🏛 Lãi vay Vietcombank (VCB +0.05% = ${bankRate}%):</span> <b style="color:var(--bad);">-${this.formatMoney(bankInterest)}</b>
            </div>` : ''}
            ${personalInterest > 0 ? `
            <div style="display:flex;justify-content:space-between;">
              <span>🤝 Lãi vay Cá Nhân (VCB +1.25% = ${personalRate}%):</span> <b style="color:var(--bad);">-${this.formatMoney(personalInterest)}</b>
            </div>` : ''}
            <div style="display:flex;justify-content:space-between;border-top:1px solid #ccc;padding-top:6px;font-weight:700;">
              <span>💵 Tiền trong két hiện tại:</span> <b style="color:${this.money < 0 ? 'var(--bad)' : 'var(--leaf)'};font-size:14px;">${this.formatMoney(this.money)}</b>
            </div>
          </div>

          ${(this.debtBank > 0 || this.debtPersonal > 0) ? `
          <div style="background:#FFF0F0;border:1px solid #FECACA;border-radius:10px;padding:8px 10px;font-size:11.5px;color:#991B1B;text-align:left;line-height:1.45;margin-bottom:10px;">
            <b>💳 DƯ NỢ KINH DOANH CHƯA TRẢ:</b><br>
            • Nợ Ngân hàng (VCB): <b>${this.formatMoney(this.debtBank || 0)}</b><br>
            • Nợ Cá nhân (Vỉa hè): <b>${this.formatMoney(this.debtPersonal || 0)}</b><br>
            <i>(Vào Menu › Vay Vốn Kinh Doanh để thanh toán bớt nợ khi có lãi nhé!)</i>
          </div>` : ''}

          <div style="background:#FFF9E6;border:1px solid #FFE082;border-radius:10px;padding:8px 10px;font-size:11.5px;color:#856404;text-align:left;line-height:1.45;">
            <b>🔔 BẮT ĐẦU NGÀY ${this.day}:</b><br>
            • Toàn bộ nguyên liệu đã được thu dọn sạch sẽ.<br>
            • Bạn cần <b>Nhập nguyên liệu ngay từ đầu</b> để bắt đầu mở bán ngày mới!<br>
            • ${this.money < 0 ? '<b style="color:var(--bad)">⚠️ Két đang bị âm tiền! Hãy bấm Vay Vốn để có tiền nhập hàng ngay.</b>' : 'Nếu không còn tiền nhập hàng, bạn có thể vay vốn kinh doanh bất cứ lúc nào.'}
          </div>
        </div>
      `,
      choices: [
        {
          t: "📦 Nhập nguyên liệu Ngày mới",
          fn: () => {
            this.paused = false;
            this.openRestockModal();
          }
        },
        ...((this.debtBank > 0 || this.debtPersonal > 0) ? [{
          t: "🏛 Quản lý & Trả nợ Vay Vốn",
          fn: () => {
            this.paused = false;
            this.openLoanModal();
          }
        }] : []),
        {
          t: "☕ Bắt đầu bán hàng Ngày mới",
          fn: () => {
            this.paused = false;
            this.showToast(`Bắt đầu Ngày ${this.day}! Hãy nhập hàng và đón khách nhé!`);
          }
        }
      ]
    });
  }

  showToast(msg) {
    this.dom.toast.textContent = msg;
    this.dom.toast.classList.add("on");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.dom.toast.classList.remove("on"), 2200);
  }

  renderSeats() {
    this.dom.seats.innerHTML = "";
    this.seats.forEach((seat, idx) => {
      const el = document.createElement("div");
      el.className = "seat";

      if (seat.locked) {
        el.className = "seat empty";
        el.innerHTML = `<span>🔒 Ghế chưa mở</span><small style="opacity:0.7">Nâng cấp Bàn ghế</small>`;
      } else if (!seat.customer) {
        el.className = "seat empty";
        el.innerHTML = `<span>Bàn trống</span>`;
      } else {
        const c = seat.customer;
        const progress = Math.max(0, c.patience / c.maxPatience);
        const circumference = 2 * Math.PI * 18;
        const strokeDashoffset = circumference * (1 - progress);
        const strokeColor = progress >= 0.35 ? "var(--ok)" : (progress >= 0.15 ? "var(--warn)" : "var(--bad)");

        el.innerHTML = `
          <div class="cust-wrap">
            <div class="avatar-ring">
              <svg class="progress-ring" width="44" height="44">
                <circle class="bg" stroke-width="3" fill="transparent" r="18" cx="22" cy="22"/>
                <circle class="bar" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" fill="transparent" r="18" cx="22" cy="22"
                  style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${strokeDashoffset}"/>
              </svg>
              <div class="avatar-face"><img src="${c.img}" alt="${c.name}"></div>
            </div>
            <div class="order-box">
              <div class="order-name">${c.name}</div>
              <div class="order-drink">${c.recipe.n}</div>
              <div class="order-recipe">${c.recipe.ings.map(k => (ITEMS[k] ? ITEMS[k].icon + " " + ITEMS[k].n : k)).join(" + ")}</div>
            </div>
          </div>
        `;
        el.onclick = () => this.tryServeCustomer(seat);
      }
      this.dom.seats.appendChild(el);
    });
  }

  renderTrays() {
    this.dom.trays.innerHTML = "";
    for (let key in ITEMS) {
      const item = ITEMS[key];
      const count = this.stock[key] || 0;
      const isLocked = !this.allMenuUnlocked && this.money < item.unlock && count === 0 && item.unlock > 0;

      const tile = document.createElement("div");
      tile.className = "tray-tile" + (isLocked ? " locked" : "");
      tile.innerHTML = `
        <div class="tile-icon">${isLocked ? "🔒" : item.icon}</div>
        <div class="tile-name">${item.n}</div>
        <div class="tile-badge ${count === 0 ? "zero" : ""}">${isLocked ? "x" : count}</div>
      `;

      if (!isLocked) {
        tile.onclick = () => this.addIngredientToCup(key);
      } else {
        tile.onclick = () => this.showToast(`Mở khóa khi đạt ${(item.unlock/1000)}k`);
      }

      this.dom.trays.appendChild(tile);
    }
  }

  addIngredientToCup(key) {
    if ((this.stock[key] || 0) <= 0) {
      snd.playServeFail();
      this.showToast(`Đã hết ${ITEMS[key].n}! Bấm Nhập hàng`);
      return;
    }
    this.stock[key]--;
    this.currentCup.push(key);
    snd.playAdd();
    this.renderTrays();
    this.renderCup();
  }

  renderCup() {
    const milk = this.dom.cupLayerMilk;
    const coffee = this.dom.cupLayerCoffee;
    const foam = this.dom.cupLayerFoam;
    const ice1 = this.dom.ice1;
    const ice2 = this.dom.ice2;

    if (this.currentCup.length === 0) {
      if (this.dom.cupIcon) this.dom.cupIcon.textContent = "🥛";
      this.dom.cupTitle.textContent = "Ly đang trống";
      this.dom.cupList.textContent = "Chạm nguyên liệu để thêm";
      if (milk) milk.style.height = "0%";
      if (coffee) coffee.style.height = "0%";
      if (foam) foam.style.height = "0%";
      if (ice1) ice1.style.display = "none";
      if (ice2) ice2.style.display = "none";
      return;
    }

    // 3D Layer dynamic height and colors based on ingredients
    const hasMilk = this.currentCup.some(k => k === "sua_dac" || k === "sua_tuoi");
    const hasCoffee = this.currentCup.some(k => k === "cafe_den" || k === "tra_dao" || k === "matcha" || k === "cacao");
    const hasFoam = this.currentCup.some(k => k === "kem_muoi" || k === "kem_trung" || k === "nuoc_dua" || k === "sua_chua");
    const hasIce = this.currentCup.includes("da_vien");

    if (milk) {
      milk.style.height = hasMilk ? (hasCoffee ? "28%" : "55%") : "0%";
      if (this.currentCup.includes("sua_dac")) {
        milk.style.background = "#FFF5EA";
      } else if (this.currentCup.includes("sua_tuoi")) {
        milk.style.background = "#FFFFFF";
      }
    }

    if (coffee) {
      coffee.style.height = hasCoffee ? (hasMilk ? (hasFoam ? "40%" : "55%") : "68%") : "0%";
      if (this.currentCup.includes("matcha")) {
        coffee.style.background = "linear-gradient(to top, #2D5A27, #4E8E42)";
      } else if (this.currentCup.includes("tra_dao")) {
        coffee.style.background = "linear-gradient(to top, #B8501E, #E27B38)";
      } else if (this.currentCup.includes("cacao")) {
        coffee.style.background = "linear-gradient(to top, #30170E, #4A2818)";
      } else {
        coffee.style.background = "linear-gradient(to top, #3A1B12, #5D2A1C)";
      }
    }

    if (foam) {
      foam.style.height = hasFoam ? "22%" : "0%";
      if (this.currentCup.includes("kem_trung")) {
        foam.style.background = "#F9DC73";
        foam.style.borderTop = "2px dotted #DEB83B";
      } else {
        foam.style.background = "#FFFCE8";
        foam.style.borderTop = "2px dotted #E2C29B";
      }
    }

    if (ice1) ice1.style.display = hasIce ? "block" : "none";
    if (ice2) ice2.style.display = hasIce ? "block" : "none";

    const matched = this.matchRecipe();
    if (matched) {
      if (this.dom.cupIcon) this.dom.cupIcon.textContent = "☕";
      this.dom.cupTitle.textContent = matched.n;
      this.dom.cupList.textContent = this.currentCup.map(k => ITEMS[k].icon).join(" ");
    } else {
      if (this.dom.cupIcon) this.dom.cupIcon.textContent = "🥣";
      this.dom.cupTitle.textContent = "Đang pha chế...";
      this.dom.cupList.textContent = this.currentCup.map(k => ITEMS[k].n).join(" + ");
    }
  }

  matchRecipe() {
    const sortedCurrent = [...this.currentCup].sort().join(",");
    for (let r of RECIPES) {
      const sortedRecipe = [...r.ings].sort().join(",");
      if (sortedCurrent === sortedRecipe) return r;
    }
    return null;
  }

  clearCup() {
    if (this.currentCup.length === 0) return;
    // Return stock
    this.currentCup.forEach(k => this.stock[k]++);
    this.currentCup = [];
    snd.playClick();
    this.renderTrays();
    this.renderCup();
  }

  tryServeCustomer(seat) {
    if (!seat || !seat.customer) return;

    if (this.currentCup.length === 0) {
      snd.playServeFail();
      this.showToast(`Ly đang trống! Khách gọi ${seat.customer.recipe.n}`);
      return;
    }

    const recipe = this.matchRecipe();
    if (!recipe || recipe.id !== seat.customer.recipe.id) {
      snd.playServeFail();
      const reqList = seat.customer.recipe.ings.map(k => (ITEMS[k] ? ITEMS[k].icon + " " + ITEMS[k].n : k)).join(" + ");
      this.showToast(`Pha chưa chuẩn 100%! ${seat.customer.name} gọi ${seat.customer.recipe.n} (${reqList})`);
      return;
    }

    // Đúng chuẩn 100% công thức món khách gọi!
    const earned = recipe.price;
    this.money += earned;
    this.dailyRevenue = (this.dailyRevenue || 0) + earned;
    this.dailyServed = (this.dailyServed || 0) + 1;

    // Thời gian khách đợi là 1p15s (75s):
    // Kịp thời gian (ratio >= 0.35): đánh giá 4.2 - 5 sao; Gần hết (ratio < 0.35): đánh giá 3.0 - 4.1 sao
    const ratio = Math.max(0, Math.min(1, seat.customer.patience / seat.customer.maxPatience));
    let ratingScore = 5.0;
    let commentList = REVIEW_COMMENTS_5;

    if (ratio >= 0.35) {
      // KỊP THỜI GIAN: 4.2 đến 5.0 SAO
      const normalized = (ratio - 0.35) / 0.65; // 0 to 1
      ratingScore = Number((4.2 + normalized * 0.8).toFixed(1));
      ratingScore = Math.min(5.0, Math.max(4.2, ratingScore));
      commentList = ratingScore >= 4.7 ? REVIEW_COMMENTS_5 : REVIEW_COMMENTS_4;
    } else {
      // GẦN HẾT THỜI GIAN: 3.0 đến 4.1 SAO
      const normalized = ratio / 0.35; // 0 to 1
      ratingScore = Number((3.0 + normalized * 1.1).toFixed(1));
      ratingScore = Math.min(4.1, Math.max(3.0, ratingScore));
      commentList = ratingScore >= 3.6 ? REVIEW_COMMENTS_4 : REVIEW_COMMENTS_3;
    }

    const comment = commentList[Math.floor(Math.random() * commentList.length)];
    const displayStars = Math.min(5, Math.max(1, Math.round(ratingScore)));

    this.reviews++;
    this.totalStars += ratingScore;
    this.rating = Math.min(5.0, Math.max(1.0, Number((this.totalStars / this.reviews).toFixed(1))));

    this.reviewList.unshift({
      name: seat.customer.name,
      img: seat.customer.img,
      stars: displayStars,
      exactRating: ratingScore,
      drink: recipe.n,
      comment: comment,
      time: "Vừa xong"
    });
    if (this.reviewList.length > 30) this.reviewList.pop();

    snd.playServeSuccess();
    snd.playCoin();
    this.showToast(`+${(earned/1000)}k! ${seat.customer.name} đánh giá ${ratingScore.toFixed(1).replace(".", ",")} ⭐`);

    seat.customer = null;
    this.currentCup = [];
    this.renderHeader();
    this.renderSeats();
    this.renderCup();
    this.save();
  }

  openDrawer() {
    snd.playClick();
    const dBackdrop = document.getElementById("drawer-backdrop");
    const dNav = document.getElementById("drawer-nav");
    if (dBackdrop) {
      dBackdrop.hidden = false;
      setTimeout(() => dBackdrop.classList.add("active"), 10);
    }
    if (dNav) dNav.classList.add("open");
  }

  closeDrawer() {
    snd.playClick();
    const dBackdrop = document.getElementById("drawer-backdrop");
    const dNav = document.getElementById("drawer-nav");
    if (dBackdrop) {
      dBackdrop.classList.remove("active");
      setTimeout(() => { dBackdrop.hidden = true; }, 300);
    }
    if (dNav) dNav.classList.remove("open");
  }

  goToHome() {
    this.paused = true;
    this.closeDrawer();
    const guide = document.getElementById("guide-screen");
    if (guide) guide.hidden = true;
    if (this.dom.splash) {
      this.dom.splash.style.display = "flex";
      this.dom.splash.classList.remove("fade-out");
    }
    this.renderHeader();
  }

  goToGuide() {
    this.paused = true;
    this.closeDrawer();
    if (this.dom.splash) this.dom.splash.style.display = "none";
    const guide = document.getElementById("guide-screen");
    if (guide) guide.hidden = false;
    snd.playClick();
  }

  goToGame() {
    snd.init();
    snd.playOpenStore();
    snd.startBGM();
    this.closeDrawer();
    const guide = document.getElementById("guide-screen");
    if (guide) guide.hidden = true;
    if (this.dom.splash) {
      this.dom.splash.classList.add("fade-out");
      setTimeout(() => {
        this.dom.splash.style.display = "none";
      }, 400);
    }
    this.resetActiveTab();
    this.paused = false;
  }

  openUserFeedbackModal() {
    this.paused = true;
    let selectedStars = 5;

    const renderFeedbackHTML = () => `
      <div style="text-align:center;">
        <h3 style="font-family:var(--fd);font-size:18px;color:var(--ink);margin-bottom:6px;">💌 Gửi Đánh Giá Cho HBcoffee</h3>
        <p style="font-size:12px;color:var(--ink2);margin-bottom:12px;">
          Ý kiến của bạn là động lực rất lớn! Kết nối cùng tác giả qua Instagram: 
          <a href="https://www.instagram.com/_soft.w_" target="_blank" rel="noopener noreferrer" style="color:var(--chili);font-weight:700;">@_soft.w_ ↗</a>
        </p>

        <div style="font-size:28px;margin-bottom:12px;cursor:pointer;user-select:none;" id="fb-star-selector">
          ${[1,2,3,4,5].map(st => `<span data-star="${st}" style="color:${st <= selectedStars ? '#F7C948' : '#D0C4BD'};padding:2px 4px;">★</span>`).join("")}
        </div>

        <input id="fb-user-name" type="text" placeholder="Tên của bạn (hoặc biệt danh)" value="Bạn Thân Thiết"
          style="width:90%;padding:8px 12px;border-radius:10px;border:1.5px solid var(--tile-line);font-family:inherit;font-size:13px;margin-bottom:8px;outline:none;">

        <textarea id="fb-user-comment" rows="3" placeholder="Viết vài dòng cảm nhận hoặc góp ý cho tiệm nhé..."
          style="width:90%;padding:8px 12px;border-radius:10px;border:1.5px solid var(--tile-line);font-family:inherit;font-size:12.5px;outline:none;resize:none;">Game rất dễ thương và chân thực, cà phê vỉa hè đỉnh nóc!</textarea>
      </div>
    `;

    this.showModal({
      content: renderFeedbackHTML(),
      choices: [
        {
          t: "Gửi Đánh Giá Ngay ⭐",
          fn: () => {
            const name = (document.getElementById("fb-user-name") ? document.getElementById("fb-user-name").value.trim() : "") || "Bạn Thân Thiết";
            const comment = (document.getElementById("fb-user-comment") ? document.getElementById("fb-user-comment").value.trim() : "") || "Quán rất tuyệt vời!";
            
            this.reviews++;
            this.totalStars += selectedStars;
            this.rating = Number((this.totalStars / this.reviews).toFixed(1));

            this.reviewList.unshift({
              name: name,
              img: "images/avatar_thanh_truc.jpg",
              stars: selectedStars,
              drink: "Cà phê muối béo ngậy xứ Huế",
              comment: comment,
              time: "Vừa xong"
            });
            if (this.reviewList.length > 30) this.reviewList.pop();

            snd.playServeSuccess();
            snd.playCoin();
            this.showToast(`🎉 Cảm ơn bạn ${name} đã đánh giá ${selectedStars}⭐ và ủng hộ @_soft.w_!`);
            this.renderHeader();
            this.save();
            this.paused = false;
          }
        },
        {
          t: "Đóng",
          fn: () => { this.paused = false; }
        }
      ]
    });

    // Star selector interaction inside modal
    const starContainer = document.getElementById("fb-star-selector");
    if (starContainer) {
      starContainer.querySelectorAll("span").forEach(s => {
        s.onclick = () => {
          selectedStars = +s.dataset.star;
          snd.playClick();
          starContainer.querySelectorAll("span").forEach(starEl => {
            const val = +starEl.dataset.star;
            starEl.style.color = val <= selectedStars ? "#F7C948" : "#D0C4BD";
          });
        };
      });
    }
  }

  bindEvents() {
    // Corner menu button (48+ drinks)
    if (this.dom.cornerMenuBtn) {
      this.dom.cornerMenuBtn.onclick = () => {
        snd.playClick();
        this.openMenuModal();
      };
    }

    // HUD reviews button
    if (this.dom.hudReviewsBtn) {
      this.dom.hudReviewsBtn.onclick = () => {
        snd.playClick();
        this.openReviewsModal();
      };
    }

    // Splash screen enter button
    if (this.dom.btnEnterShop) {
      this.dom.btnEnterShop.onclick = () => this.goToGame();
    }

    // Home screen secondary buttons
    const btnOpenGuide = document.getElementById("btn-open-guide");
    if (btnOpenGuide) {
      btnOpenGuide.onclick = () => this.goToGuide();
    }

    const btnHomeMenuBoard = document.getElementById("btn-home-menu-board");
    if (btnHomeMenuBoard) {
      btnHomeMenuBoard.onclick = () => {
        snd.playClick();
        this.openMenuModal();
      };
    }

    const btnQuickReviewHome = document.getElementById("btn-quick-review-home");
    if (btnQuickReviewHome) {
      btnQuickReviewHome.onclick = () => this.openUserFeedbackModal();
    }
    document.querySelectorAll(".home-connect-text").forEach(el => {
      el.style.cursor = "pointer";
      el.onclick = () => this.openUserFeedbackModal();
    });

    // Guide screen buttons
    const btnGuideBack = document.getElementById("btn-guide-back");
    if (btnGuideBack) btnGuideBack.onclick = () => this.goToHome();

    const btnGuideBackHome = document.getElementById("btn-guide-back-home");
    if (btnGuideBackHome) btnGuideBackHome.onclick = () => this.goToHome();

    const btnGuidePlay = document.getElementById("btn-guide-play");
    if (btnGuidePlay) btnGuidePlay.onclick = () => this.goToGame();

    const btnGuideUnlockAll = document.getElementById("btn-guide-unlock-all");
    if (btnGuideUnlockAll) btnGuideUnlockAll.onclick = () => this.unlockAllMenu();

    // 3-Bar Hamburger Menu Buttons
    const btnHomeMenu = document.getElementById("btn-home-menu");
    if (btnHomeMenu) btnHomeMenu.onclick = () => this.openDrawer();

    const btnGameMenu = document.getElementById("btn-game-menu");
    if (btnGameMenu) btnGameMenu.onclick = () => this.openDrawer();

    const btnGuideMenu = document.getElementById("btn-guide-menu");
    if (btnGuideMenu) btnGuideMenu.onclick = () => this.openDrawer();

    // Drawer close buttons
    const btnDrawerClose = document.getElementById("btn-drawer-close");
    if (btnDrawerClose) btnDrawerClose.onclick = () => this.closeDrawer();

    const drawerBackdrop = document.getElementById("drawer-backdrop");
    if (drawerBackdrop) drawerBackdrop.onclick = () => this.closeDrawer();

    // Drawer link buttons
    document.querySelectorAll(".drawer-link-btn").forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.action;
        snd.playClick();
        this.closeDrawer();
        if (action === "home") this.goToHome();
        else if (action === "game") this.goToGame();
        else if (action === "guide") this.goToGuide();
        else if (action === "menu") this.openMenuModal();
        else if (action === "reviews") this.openReviewsModal();
        else if (action === "restock") this.openRestockModal();
        else if (action === "upgrade") this.openUpgradeModal();
        else if (action === "edit_name") this.openEditNameModal();
        else if (action === "unlock") this.unlockAllMenu();
        else if (action === "loan") this.openLoanModal();
        else if (action === "profiles") this.openProfilesModal();
      };
    });

    // Home Music toggle
    const btnHomeMusic = document.getElementById("btn-home-music");
    if (btnHomeMusic) {
      btnHomeMusic.onclick = () => {
        const isEnabled = snd.toggle();
        btnHomeMusic.style.opacity = isEnabled ? "1" : "0.5";
        if (this.dom.btnMusic) this.dom.btnMusic.style.opacity = isEnabled ? "1" : "0.5";
        this.showToast(isEnabled ? "Bật âm thanh & Lo-Fi BGM 📻" : "Đã tắt âm thanh 🔇");
      };
    }

    // Home Fullscreen toggle
    const btnHomeFs = document.getElementById("btn-home-fullscreen");
    if (btnHomeFs) {
      btnHomeFs.onclick = () => {
        snd.playClick();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
        }
      };
    }

    // Music toggle button in game HUD
    if (this.dom.btnMusic) {
      this.dom.btnMusic.onclick = () => {
        const isEnabled = snd.toggle();
        this.dom.btnMusic.style.opacity = isEnabled ? "1" : "0.5";
        if (btnHomeMusic) btnHomeMusic.style.opacity = isEnabled ? "1" : "0.5";
        this.showToast(isEnabled ? "Bật âm thanh & Lo-Fi BGM 📻" : "Đã tắt âm thanh 🔇");
      };
    }

    // Fullscreen toggle button (Desktop / PC)
    if (this.dom.btnFullscreen) {
      this.dom.btnFullscreen.onclick = () => {
        snd.playClick();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
        }
      };
    }

    this.dom.btnClear.onclick = () => this.clearCup();
    this.dom.btnServe.onclick = () => {
      // Serve to first waiting customer that matches
      if (this.currentCup.length === 0) {
        snd.playServeFail();
        this.showToast("Ly đang trống! Chạm nguyên liệu để pha.");
        return;
      }
      const recipe = this.matchRecipe();
      if (!recipe) {
        snd.playServeFail();
        this.showToast("Công thức pha chế chưa đúng theo menu!");
        return;
      }
      const waiting = this.seats.find(s => s.customer && s.customer.recipe.id === recipe.id);
      if (waiting) {
        this.tryServeCustomer(waiting);
      } else {
        snd.playServeFail();
        this.showToast(`Đã pha đúng ${recipe.n}, nhưng không có bàn nào gọi món này!`);
      }
    };

    // Bottom Navigation
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const action = tab.dataset.tab;
        snd.playClick();
        if (action === "play") {
          this.dom.modal.hidden = true;
          this.paused = false;
        }
        else if (action === "menu") this.openMenuModal();
        else if (action === "reviews") this.openReviewsModal();
        else if (action === "restock") this.openRestockModal();
        else if (action === "upgrade") this.openUpgradeModal();
        else if (action === "edit_name") this.openEditNameModal();
      };
    });

    // Pause button
    document.getElementById("btn-pause").onclick = () => {
      this.paused = !this.paused;
      snd.playClick();
      this.showToast(this.paused ? "Đã tạm dừng quán" : "Tiếp tục bán hàng");
    };

    // Desktop / Laptop Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        this.dom.btnServe.click();
      } else if (e.key === "c" || e.key === "C") {
        this.clearCup();
      } else if (e.key === "m" || e.key === "M") {
        this.openMenuModal();
      } else if (e.key === "r" || e.key === "R") {
        this.openReviewsModal();
      } else if (e.key === "p" || e.key === "P") {
        document.getElementById("btn-pause").click();
      } else if (e.key === "u" || e.key === "U") {
        this.unlockAllMenu();
      } else if (e.key === "Escape") {
        if (!this.dom.modal.hidden) {
          this.dom.modal.hidden = true;
          this.paused = false;
        }
      }
    });
  }

  openMenuModal(selectedCat = "all", searchQuery = "") {
    this.paused = true;

    const filtered = RECIPES.filter(r => {
      const matchCat = selectedCat === "all" || r.cat === selectedCat;
      const matchSearch = !searchQuery || r.n.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    let html = `
      <div class="menu-board-chalk">
        <h2 class="menu-chalk-title">📜 THỰC ĐƠN HBcoffee</h2>
        <p class="menu-chalk-sub">Hương Vị Phố Phường Thân Thương • 48 Loại Đồ Uống & Ăn Vặt</p>

        <!-- NÚT MỞ KHÓA TOÀN BỘ 48 MÓN -->
        <div style="margin: 10px 0 14px; text-align: center;">
          ${this.allMenuUnlocked ? `
            <div style="background: rgba(136,212,158,0.22); border: 1.5px solid #88D49E; color: #88D49E; padding: 9px 14px; border-radius: 12px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px;">
              <span>✅</span> <span>ĐÃ MỞ KHÓA TOÀN BỘ 48 MÓN TRONG MENU</span>
            </div>
          ` : `
            <button id="btn-unlock-all-menu" style="background: linear-gradient(135deg, #FFB300, #E65100); color: #fff; border: 2px solid rgba(255,255,255,0.4); padding: 10px 20px; border-radius: 14px; font-weight: 800; font-size: 13.5px; cursor: pointer; box-shadow: 0 4px 14px rgba(230,81,0,0.4); display: inline-flex; align-items: center; gap: 8px; font-family: inherit;">
              <span>🔓</span> <span>MỞ KHÓA TOÀN BỘ 48 MÓN NGAY (MIỄN PHÍ)</span>
            </button>
          `}
        </div>

        <input type="text" id="menu-search-input" class="menu-search-box" placeholder="🔍 Tìm tên món (ví dụ: muối, đào, bạc xỉu, matcha...)" value="${searchQuery}">

        <div class="menu-filter-chips">
          ${MENU_CATEGORIES.map(c => `
            <button class="menu-chip-btn ${selectedCat === c.id ? "active" : ""}" data-cat="${c.id}">${c.n}</button>
          `).join("")}
        </div>

        <div class="menu-items-grid">
          ${filtered.length === 0 ? `<div style="text-align:center;padding:20px;color:#C4D4C0;font-size:12px;">Không tìm thấy món phù hợp</div>` : ""}
          ${filtered.map(r => {
            const isUnlocked = this.allMenuUnlocked || r.ings.every(k => ITEMS[k].unlock === 0 || this.money >= ITEMS[k].unlock || (this.stock[k] || 0) > 0);
            const formula = r.ings.map(k => `${ITEMS[k].icon} ${ITEMS[k].n}`).join(" + ");
            return `
              <div class="menu-item-row">
                <div class="menu-item-info">
                  <div class="menu-item-name">${r.n} ${isUnlocked ? "" : "🔒"}</div>
                  <div class="menu-item-desc">${r.desc || ""}</div>
                  <div class="menu-item-formula">${formula}</div>
                </div>
                <div style="text-align:right;">
                  <div class="menu-item-price">${(r.price/1000)}k</div>
                  <small style="font-size:9px;color:${isUnlocked ? "#88D49E" : "#E29080"}">${isUnlocked ? "✓ Sẵn sàng" : "Chưa mở"}</small>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    this.showModal({
      content: html,
      choices: [
        {
          t: "Đóng bảng Menu",
          fn: () => { this.paused = false; }
        }
      ]
    });

    // Bind unlock all button click
    const unlockBtn = document.getElementById("btn-unlock-all-menu");
    if (unlockBtn) {
      unlockBtn.onclick = () => {
        this.unlockAllMenu();
        this.openMenuModal(selectedCat, searchQuery);
      };
    }

    // Bind chip clicks
    this.dom.card.querySelectorAll(".menu-chip-btn").forEach(btn => {
      btn.onclick = () => {
        const cat = btn.dataset.cat;
        snd.playClick();
        const searchVal = document.getElementById("menu-search-input") ? document.getElementById("menu-search-input").value : "";
        this.openMenuModal(cat, searchVal);
      };
    });

    // Bind search input
    const sInput = document.getElementById("menu-search-input");
    if (sInput) {
      sInput.oninput = (e) => {
        this.openMenuModal(selectedCat, e.target.value);
        const newInput = document.getElementById("menu-search-input");
        if (newInput) {
          newInput.focus();
          newInput.setSelectionRange(newInput.value.length, newInput.value.length);
        }
      };
    }
  }

  openReviewsModal() {
    this.paused = true;

    // Calculate star counts
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.reviewList.forEach(r => {
      if (counts[r.stars] !== undefined) counts[r.stars]++;
    });

    let html = `
      <div class="reviews-container">
        <h3 style="font-family:var(--fd);font-size:18px;color:var(--ink);text-align:center;margin-bottom:6px;">⭐ Đánh Giá Từ Khách Hàng</h3>
        <p style="font-size:11.5px;color:var(--ink2);text-align:center;margin-bottom:12px;">Đánh giá thực tế tăng và sao thay đổi theo tốc độ phục vụ.</p>

        <div class="reviews-hero-box">
          <div class="reviews-hero-score">
            <span class="reviews-big-num">${this.rating.toFixed(1).replace(".", ",")}</span>
            <div class="reviews-stars-visual">${"★".repeat(Math.min(5, Math.round(this.rating)))}${"☆".repeat(Math.max(0, 5 - Math.round(this.rating)))}</div>
            <span class="reviews-count-sub">${this.reviews} lượt đánh giá</span>
          </div>
          <div style="font-size:10.5px;color:var(--ink2);line-height:1.6;">
            <div>⭐⭐⭐⭐⭐: <b>${counts[5]}</b> lượt</div>
            <div>⭐⭐⭐⭐: <b>${counts[4]}</b> lượt</div>
            <div>⭐⭐⭐: <b>${counts[3]}</b> lượt</div>
            <div>⭐⭐: <b>${counts[2]}</b> lượt</div>
            <div>⭐: <b>${counts[1]}</b> lượt</div>
          </div>
        </div>

        <div style="font-weight:700;font-size:12px;color:var(--ink);margin-bottom:8px;">Nhật ký nhận xét gần nhất:</div>

        <div class="reviews-list-box">
          ${this.reviewList.map(r => `
            <div class="customer-card-item">
              <div class="customer-card-header">
                <div class="customer-card-user">
                  <img src="${r.img || 'images/avatar_kha_ngan.jpg'}" alt="${r.name}">
                  <span class="customer-card-name">${r.name}</span>
                </div>
                <div style="text-align:right;">
                  <div class="customer-card-stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
                  <span class="customer-card-time">${r.time}</span>
                </div>
              </div>
              <div class="customer-card-comment">"${r.comment}"</div>
              ${r.drink ? `<div class="customer-card-drink">☕ Món: ${r.drink}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
    `;

    this.showModal({
      content: html,
      choices: [
        {
          t: "Đóng",
          fn: () => { this.paused = false; }
        }
      ]
    });
  }

  openRestockModal() {
    this.paused = true;
    let html = `
      <div style="text-align:left;max-height:380px;overflow-y:auto;padding-right:4px;">
        <h3 style="font-family:var(--fd);font-size:16px;color:var(--ink);margin-bottom:4px;">📦 Nhập nguyên liệu pha chế</h3>
        <p style="font-size:12px;color:var(--ink2);margin-bottom:8px;">Bổ sung kho để không bị hết hàng giữa ca.</p>
        
        <!-- Ô HỖ TRỢ VAY VỐN KHI THIẾU TIỀN NHẬP HÀNG -->
        <div style="background:linear-gradient(135deg, rgba(16,185,129,0.08), rgba(245,158,11,0.08));border:1.5px dashed #059669;border-radius:12px;padding:8px 10px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div>
              <div style="font-size:12px;font-weight:700;color:var(--ink);">💳 Thiếu vốn nhập hàng?</div>
              <div style="font-size:10.5px;color:var(--ink2);">Két: <b style="color:${this.money < 0 ? 'var(--bad)' : 'var(--leaf)'}">${this.formatMoney(this.money)}</b> | Nợ: <b style="color:var(--bad)">${this.formatMoney(this.debt || 0)}</b></div>
            </div>
            <button id="btn-restock-open-loan" style="background:none;border:none;color:var(--chili);font-size:11px;font-weight:700;text-decoration:underline;cursor:pointer;">Chi tiết ›</button>
          </div>
          <div style="display:flex;gap:4px;">
            <button class="restock-loan-btn" data-amt="50000" data-prov="bank" style="flex:1;background:#059669;color:#fff;border:none;padding:5px 6px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;" title="Lãi VCB + 0.05%">🏛 VCB +50k</button>
            <button class="restock-loan-btn" data-amt="100000" data-prov="bank" style="flex:1;background:#047857;color:#fff;border:none;padding:5px 6px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;" title="Lãi VCB + 0.05%">🏛 VCB +100k</button>
            <button class="restock-loan-btn" data-amt="50000" data-prov="personal" style="flex:1;background:#D97706;color:#fff;border:none;padding:5px 6px;border-radius:6px;font-size:10.5px;font-weight:700;cursor:pointer;" title="Lãi VCB + 1.25%">🤝 Cá Nhân +50k</button>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;">
    `;

    for (let k in ITEMS) {
      const it = ITEMS[k];
      const count = this.stock[k] || 0;
      html += `
        <div style="display:flex;align-items:center;justify-content:space-between;background:#F9F4F2;padding:6px 10px;border-radius:10px;">
          <div><b>${it.icon} ${it.n}</b> <span style="font-size:11px;color:var(--ink2)">(${count})</span></div>
          <button class="buy-btn" data-k="${k}" style="background:var(--chili);color:#fff;border:none;padding:5px 12px;border-radius:8px;font-weight:700;font-size:12px;cursor:pointer;">
            +5 (${(it.cost*5/1000)}k)
          </button>
        </div>
      `;
    }
    html += `</div></div>`;

    this.showModal({
      content: html,
      choices: [
        {
          t: "Đóng cửa sổ",
          fn: () => { this.paused = false; this.renderTrays(); this.renderHeader(); }
        }
      ]
    });

    // Bind loan clicks
    this.dom.card.querySelectorAll(".restock-loan-btn").forEach(btn => {
      btn.onclick = () => {
        const amt = +btn.dataset.amt;
        const prov = btn.dataset.prov || 'bank';
        this.borrowLoan(amt, prov);
        this.openRestockModal();
      };
    });

    const btnRestockOpenLoan = this.dom.card.querySelector("#btn-restock-open-loan");
    if (btnRestockOpenLoan) {
      btnRestockOpenLoan.onclick = () => {
        this.openLoanModal();
      };
    }

    // Bind buy clicks
    this.dom.card.querySelectorAll(".buy-btn").forEach(btn => {
      btn.onclick = () => {
        const k = btn.dataset.k;
        const total = ITEMS[k].cost * 5;
        if (this.money < total) {
          snd.playServeFail();
          this.showToast(`Không đủ tiền! Két còn ${this.formatMoney(this.money)}. Bấm vay Ngân Hàng hoặc Cá Nhân ở trên nhé!`);
          return;
        }
        this.money -= total;
        this.stock[k] = (this.stock[k] || 0) + 5;
        snd.playCoin();
        this.showToast(`Đã nhập 5 ${ITEMS[k].n}`);
        this.renderHeader();
        this.openRestockModal();
      };
    });
  }

  openUpgradeModal() {
    this.paused = true;
    const up = [
      { id: "chair", n: "Thêm 2 Ghế cóc vỉa hè", d: "Mở rộng quán thành 4 bàn đón khách", cost: 100000, active: this.upgrades.chair },
      { id: "fan",   n: "Quạt hơi nước mát rượi", d: "Khách chịu ngồi chờ lâu hơn 30%", cost: 150000, active: this.upgrades.fan },
      { id: "wifi",  n: "Gói cước Wi-Fi cáp quang", d: "Khách lướt mạng nên kiên nhẫn hơn 20%", cost: 120000, active: this.upgrades.wifi },
      { id: "sign",  n: "Biển hiệu Neon Cà Phê", d: "Tăng 30% tần suất khách ghé quán", cost: 200000, active: this.upgrades.sign },
      { id: "all_menu", n: "👑 Trọn Bộ Thực Đơn 48 Món", d: "Mở khóa toàn bộ 21 nguyên liệu & 48 loại thức uống", cost: 0, active: this.allMenuUnlocked }
    ];

    let html = `
      <div style="text-align:left;max-height:360px;overflow-y:auto;">
        <h3 style="font-family:var(--fd);font-size:16px;color:var(--ink);margin-bottom:8px;">⭐ Nâng cấp Quán Cà Phê</h3>
        <div style="display:flex;flex-direction:column;gap:8px;">
    `;

    up.forEach(u => {
      html += `
        <div style="background:#F9F4F2;padding:8px 10px;border-radius:12px;display:flex;align-items:center;justify-content:space-between;">
          <div style="max-width:210px;">
            <div style="font-weight:800;font-size:13px;color:var(--ink);">${u.n}</div>
            <div style="font-size:11px;color:var(--ink2);">${u.d}</div>
          </div>
          <button class="up-buy-btn" data-id="${u.id}" data-cost="${u.cost}" ${u.active ? "disabled" : ""}
            style="background:${u.active ? "#C4B2AA" : (u.id === "all_menu" ? "linear-gradient(135deg, #FFB300, #E65100)" : "var(--ok)")};color:#fff;border:none;padding:6px 12px;border-radius:10px;font-weight:800;font-size:11.5px;cursor:pointer;">
            ${u.active ? "Đã sở hữu" : (u.id === "all_menu" ? "Mở Khóa Miễn Phí" : (u.cost/1000) + "k")}
          </button>
        </div>
      `;
    });
    html += `</div></div>`;

    this.showModal({
      content: html,
      choices: [
        {
          t: "Xong",
          fn: () => { this.paused = false; this.save(); }
        }
      ]
    });

    this.dom.card.querySelectorAll(".up-buy-btn").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const cost = +btn.dataset.cost;

        if (id === "all_menu") {
          this.unlockAllMenu();
          this.openUpgradeModal();
          return;
        }

        if (this.money < cost) {
          snd.playServeFail();
          this.showToast("Không đủ tiền trong két!");
          return;
        }
        this.money -= cost;
        this.upgrades[id] = true;
        if (id === "chair") {
          this.seats[2].locked = false;
          this.seats[3].locked = false;
          this.shopRank = "QUÁN ĐÔNG KHÁCH";
        }
        snd.playCoin();
        snd.playServeSuccess();
        this.showToast("Nâng cấp thành công!");
        this.renderHeader();
        this.renderSeats();
        this.openUpgradeModal();
      };
    });
  }

  openEditNameModal() {
    this.paused = true;
    const current = this.shopName;
    const html = `
      <div style="text-align:center;">
        <h3 style="font-family:var(--fd);font-size:17px;color:var(--ink);margin-bottom:6px;">🏷️ Đổi Tên Quán</h3>
        <p style="font-size:12.5px;color:var(--ink2);margin-bottom:14px;">Nhập tên tiệm cà phê của riêng bạn:</p>
        <input id="input-shop-name" type="text" value="${current}" maxlength="16"
          style="width:90%;padding:10px 14px;border-radius:12px;border:2px solid var(--tile-line);font-family:var(--fd);font-size:16px;text-align:center;color:var(--ink);outline:none;">
      </div>
    `;

    this.showModal({
      content: html,
      choices: [
        {
          t: "Lưu tên mới",
          fn: () => {
            const val = document.getElementById("input-shop-name").value.trim();
            if (val) this.shopName = val;
            this.paused = false;
            this.renderHeader();
            this.save();
            snd.playClick();
          }
        },
        {
          t: "Hủy",
          fn: () => { this.paused = false; }
        }
      ]
    });
  }

  // POP-UP DRAMA DIALOG (MATCHING SCREENSHOT 100%)
  triggerDrama(dramaData) {
    this.paused = true;
    snd.playDrama();

    const avatar = dramaData.avatar || "images/avatar_kha_ngan.jpg";
    const tag = dramaData.tag || "KHÁCH GÂY RỐI";
    const title = dramaData.title || "Khả Ngân say xỉn làm ồn";
    const text = dramaData.text || "Khả Ngân vừa nhậu ở quán bên cạnh qua, nói to hát hò làm các bàn khác khó chịu.";

    const isImg = String(avatar).endsWith(".jpg") || String(avatar).endsWith(".png");
    const avatarHtml = isImg ? `<img src="${avatar}" alt="Avatar">` : avatar;

    const content = `
      <div class="drama">
        <div class="dface">${avatarHtml}</div>
        <span class="dtag">${tag}</span>
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
    `;

    this.showModal({
      content: content,
      choices: dramaData.choices,
      lockTime: 1200 // Lock bar animation exactly like aenhatrang.com!
    });
  }

  showModal({ content, choices, lockTime = 0 }) {
    this.dom.card.innerHTML = content + `
      <div class="btns">
        ${choices.map((c, i) => `
          <button class="${i === 0 ? "pri" : ""}" data-idx="${i}">
            ${c.t}
            ${c.h ? `<small>${c.h}</small>` : ""}
          </button>
        `).join("")}
      </div>
    `;
    this.dom.modal.hidden = false;

    if (lockTime > 0) {
      this.dom.card.classList.add("lock");
      setTimeout(() => this.dom.card.classList.remove("lock"), lockTime);
    }

    this.dom.card.querySelectorAll(".btns button").forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.idx;
        this.dom.modal.hidden = true;
        this.resetActiveTab();
        choices[idx].fn();
      };
    });
  }

  resetActiveTab() {
    document.querySelectorAll(".nav-tab").forEach(t => {
      if (t.dataset.tab === "play") t.classList.add("active");
      else t.classList.remove("active");
    });
  }

  getRandomDramaDelay() {
    // Tần suất 2 đến 3 phút: từ 120 giây (120,000ms) đến 180 giây (180,000ms)
    return (120 + Math.random() * 60) * 1000;
  }

  startLoop() {
    setInterval(() => {
      if (this.paused) return;

      // Mỗi nhịp 500ms đếm thời gian: 1 ngày chơi kéo dài đúng 5 phút = 300 giây (Requirement 4)
      this.dayElapsedSeconds = (this.dayElapsedSeconds || 0) + 0.5;

      // Giờ in-game: mở cửa từ 07:00 sáng đến 23:00 đêm (16 tiếng = 960 phút in-game)
      const dayProgress = Math.min(1, this.dayElapsedSeconds / 300);
      const totalInGameMin = Math.floor(dayProgress * 960);
      this.hour = 7 + Math.floor(totalInGameMin / 60);
      this.minute = totalInGameMin % 60;

      // Khi hết 5 phút (300 giây) -> Kết thúc ngày, sang ngày mới (Requirement 4 & 5)
      if (this.dayElapsedSeconds >= 300) {
        this.endCurrentDay();
        return;
      }

      // Update customer patience (mỗi nhịp 500ms giảm 0.5s => 1 giây thực giảm 1s)
      this.seats.forEach(s => {
        if (s.customer) {
          s.customer.patience -= 0.5;
          if (s.customer.patience <= 0) {
            // Customer walked away in anger!
            this.reviews++;
            this.totalStars += 1;
            this.rating = Math.min(5.0, Math.max(1.0, Number((this.totalStars / this.reviews).toFixed(1))));

            const badComment = REVIEW_COMMENTS_BAD[Math.floor(Math.random() * REVIEW_COMMENTS_BAD.length)];
            this.reviewList.unshift({
              name: s.customer.name,
              img: s.customer.img,
              stars: 1,
              drink: s.customer.recipe.n,
              comment: badComment,
              time: "Vừa xong"
            });
            if (this.reviewList.length > 30) this.reviewList.pop();

            this.showToast(`${s.customer.name} đợi hơn 1p15s nên bực tức bỏ về! (-⭐)`);
            s.customer = null;
            snd.playServeFail();
            this.checkRatingPenalty();
            this.renderHeader();
            this.save();
          }
        }
      });

      // Spawn customer if empty seat
      const emptySeat = this.seats.find(s => !s.locked && !s.customer);
      const spawnChance = this.upgrades.sign ? 0.30 : 0.18;
      if (emptySeat && Math.random() < spawnChance) {
        this.spawnCustomer(emptySeat);
      }

      // Sự cố / sự kiện kịch tính xảy ra chuẩn tần suất 2 - 3 phút một lần
      const now = Date.now();
      if (now - this.lastDramaTime >= this.nextDramaDelay) {
        this.lastDramaTime = now;
        this.nextDramaDelay = this.getRandomDramaDelay();
        this.pickRandomDrama();
      }

      this.renderHeader();
      this.renderSeats();
    }, 500);
  }

  spawnCustomer(seat) {
    const cust = ANIME_CUSTOMERS[Math.floor(Math.random() * ANIME_CUSTOMERS.length)];

    // Only pick recipes that can be made with unlocked ingredients or ingredients in stock (or all if unlocked)
    const availableRecipes = this.allMenuUnlocked
      ? RECIPES
      : RECIPES.filter(r => r.ings.every(k => ITEMS[k].unlock === 0 || this.money >= ITEMS[k].unlock || (this.stock[k] || 0) > 0));
    const recipe = availableRecipes.length > 0
      ? availableRecipes[Math.floor(Math.random() * availableRecipes.length)]
      : RECIPES[0];

    // Thời gian khách đợi chuẩn: 1 phút 15 giây (75 giây)
    let basePatience = 75;
    if (this.upgrades.fan) basePatience += 15;
    if (this.upgrades.wifi) basePatience += 10;

    seat.customer = {
      name: cust.name,
      img: cust.img,
      recipe: recipe,
      patience: basePatience,
      maxPatience: basePatience
    };
  }

  pickRandomDrama() {
    const events = [
      // SỰ KIỆN 1: ĐÚNG NHƯ TRONG ẢNH CỦA BẠN!
      {
        avatar: "images/avatar_kha_ngan.jpg",
        tag: "KHÁCH GÂY RỐI",
        title: "Khả Ngân say xỉn làm ồn",
        text: "Khả Ngân vừa nhậu ở quán ốc bên cạnh qua, nói to hát hò làm các bàn khác khó chịu.",
        choices: [
          {
            t: "Mời khách về",
            h: "mất một khách",
            fn: () => {
              const sitting = this.seats.find(s => s.customer);
              if (sitting) sitting.customer = null;
              this.paused = false;
              this.showToast("Khả Ngân lảo đảo ra về, quán yên tĩnh lại");
            }
          },
          {
            t: "Pha ly trà gừng",
            h: "tốn 5k, hên xui",
            fn: () => {
              this.money -= 5000;
              this.paused = false;
              if (Math.random() < 0.6) {
                this.showToast("Uống trà gừng xong Khả Ngân tỉnh táo, tip thêm 20k!");
                this.money += 20000;
                snd.playCoin();
              } else {
                this.showToast("Uống xong hát to hơn, khách khác bực bội!");
                this.rating = Math.max(3.0, this.rating - 0.05);
              }
            }
          },
          {
            t: "Kệ khách",
            h: "khách khác mất kiên nhẫn nhanh hơn",
            fn: () => {
              this.seats.forEach(s => { if (s.customer) s.customer.patience -= 12; });
              this.paused = false;
              this.showToast("Ồn ào kéo dài, các bàn khác bắt đầu sốt ruột");
            }
          }
        ]
      },
      // SỰ KIỆN 2: TRẬT TỰ ĐÔ THỊ
      {
        avatar: "images/avatar_trat_tu.jpg",
        tag: "SỰ CỐ VỈA HÈ",
        title: "Trật tự phường đi kiểm tra!",
        text: "Xe trật tự đô thị vừa rẽ vào đầu ngõ, bàn ghế vỉa hè quán đang bày hơi lấn vạch sơn.",
        choices: [
          {
            t: "Bê bàn ghế chạy thục mạng",
            h: "hên xui rơi rớt ly tách",
            fn: () => {
              this.paused = false;
              if (Math.random() < 0.5) {
                this.showToast("Kịp bê đồ vào trong hiên, an toàn không bị phạt!");
              } else {
                this.money -= 15000;
                this.showToast("Vội quá làm vỡ 3 cái ly, tốn 15k thay mới!");
              }
            }
          },
          {
            t: "Nộp phạt trật tự đô thị",
            h: "tốn 30k tiền xử phạt",
            fn: () => {
              this.money -= 30000;
              this.paused = false;
              this.showToast("Đã đóng phạt 30k, được nhắc nhở lần sau kê gọn vào");
            }
          },
          {
            t: "Kê gọn sát vách tường",
            h: "khách ngồi hơi chật một chút",
            fn: () => {
              this.paused = false;
              this.showToast("Các chú trật tự nhắc nhở rồi đi tiếp");
            }
          }
        ]
      },
      // SỰ KIỆN 3: XIN PASS WIFI
      {
        avatar: "images/avatar_hoang_bach.jpg",
        tag: "KHÁCH GÂY RỐI",
        title: "Hoàng Bách xin pass Wi-Fi tải game 80GB",
        text: "Bách gọi một ly đen đá 15k rồi cắm máy kéo game nguyên buổi làm nghẽn sạch mạng của quán.",
        choices: [
          {
            t: "Rút dây nguồn modem",
            h: "báo mất mạng, khách tự về",
            fn: () => {
              this.paused = false;
              this.showToast("Modem tắt ngúm, Bách đành gập laptop đứng dậy đi về");
            }
          },
          {
            t: "Nâng cấp gói cước băng thông",
            h: "tốn 20k cước mạng",
            fn: () => {
              this.money -= 20000;
              this.paused = false;
              this.showToast("Mạng mượt trở lại, khách chấm quán 5 sao!");
              this.rating = Math.min(5.0, this.rating + 0.05);
            }
          },
          {
            t: "Kệ khách",
            h: "các bàn khác không load được TikTok",
            fn: () => {
              this.paused = false;
              this.rating = Math.max(3.0, this.rating - 0.04);
              this.showToast("Khách bàn khác phàn nàn Wi-Fi yếu");
            }
          }
        ]
      },
      // SỰ KIỆN 4: CA SĨ KẸO KÉO
      {
        avatar: "images/avatar_chu_ba.jpg",
        tag: "SỰ KIỆN ĐƯỜNG PHỐ",
        title: "Chú Ba mang loa kéo Bolero",
        text: "Chú Ba kéo loa di động đến trước quán, cất giọng bài 'Đắp Mộ Cuộc Tình' cực ngọt.",
        choices: [
          {
            t: "Mua ủng hộ 2 thanh kẹo",
            h: "tốn 10k, khách khen tốt bụng",
            fn: () => {
              this.money -= 10000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.03);
              this.showToast("Mua kẹo mời khách, ai nấy đều tấm tắc khen chủ quán!");
            }
          },
          {
            t: "Mời chú hát tặng một bài",
            h: "quán náo nhiệt, đông khách hơn",
            fn: () => {
              this.paused = false;
              this.showToast("Cả quán vỗ tay theo điệu nhạc Bolero, không khí cực vui!");
              this.rating = Math.min(5.0, this.rating + 0.05);
            }
          },
          {
            t: "Nhờ chú đi quán khác",
            h: "giữ yên tĩnh cho quán",
            fn: () => {
              this.paused = false;
              this.showToast("Chú Ba chào rồi kéo loa sang quán trà sữa bên cạnh");
            }
          }
        ]
      },
      // SỰ KIỆN 5: CƠN MƯA RÀO VỈA HÈ
      {
        avatar: "images/avatar_ngoc_diep.jpg",
        tag: "THỜI TIẾT",
        title: "Cơn mưa rào bất chợt ập xuống!",
        text: "Trời bỗng đổ mưa như trút nước, gió thổi tạt ướt cả góc vỉa hè trước quán.",
        choices: [
          {
            t: "Kéo bạt che vỉa hè",
            h: "khách chen nhau nhưng ấm cúng",
            fn: () => {
              this.paused = false;
              this.showToast("Kéo bạt che mưa, khách khen chủ quán nhanh nhẹn!");
              this.rating = Math.min(5.0, this.rating + 0.04);
            }
          },
          {
            t: "Mời khách vào trong nhà",
            h: "khách cảm động tip thêm tiền",
            fn: () => {
              this.paused = false;
              this.money += 20000;
              snd.playCoin();
              this.showToast("Khách cảm động vì không bị ướt, tip thêm 20k!");
              this.rating = Math.min(5.0, this.rating + 0.05);
            }
          },
          {
            t: "Cho khách mượn dù",
            h: "tốn 15k mua dù mới bù kho",
            fn: () => {
              this.money -= 15000;
              this.paused = false;
              this.showToast("Khách cầm dù cảm ơn rối rít ra về!");
            }
          }
        ]
      },
      // SỰ KIỆN 6: CHỐT DỰ ÁN TRIỆU ĐÔ
      {
        avatar: "images/avatar_tuan_anh.jpg",
        tag: "KHÁCH GÂY RỐI",
        title: "Nhóm anh Tuấn chốt dự án nghìn tỷ",
        text: "Nhóm mặc vest bảnh bao mang iPad ra vẽ mô hình kim tự tháp, hô hào triệu đô làm náo loạn cả quán.",
        choices: [
          {
            t: "Mời bình trà đá lớn miễn phí",
            h: "tốn 5k, họ dịu giọng nói nhỏ lại",
            fn: () => {
              this.money -= 5000;
              this.paused = false;
              this.showToast("Uống trà đá xong nhóm anh Tuấn nói nhỏ nhẹ văn minh hẳn!");
            }
          },
          {
            t: "Nhắc nhở giữ trật tự quán",
            h: "khách tự ái bỏ về, thanh toán 15k",
            fn: () => {
              this.paused = false;
              this.money += 15000;
              snd.playCoin();
              this.showToast("Nhóm anh Tuấn tính tiền 15k rồi gom đồ ra xe hơi đi mất");
            }
          },
          {
            t: "Kệ họ hô hào",
            h: "bàn bên cạnh sốt ruột đeo tai nghe",
            fn: () => {
              this.paused = false;
              this.rating = Math.max(3.0, this.rating - 0.03);
              this.showToast("Khách bàn bên phàn nàn quán ồn ào quá");
            }
          }
        ]
      },
      // SỰ KIỆN 7: THANH TRÚC VẼ SKETCH BỊ TẠT NƯỚC
      {
        avatar: "images/avatar_thanh_truc.jpg",
        tag: "SỰ CỐ KHÁCH HÀNG",
        title: "Thanh Trúc vẽ tranh bị xe tạt nước mưa",
        text: "Trúc đang nắn nót vẽ màu nước góc quán thì chiếc xe máy chạy vèo qua tạt nước mưa văng trúng mép giấy vẽ.",
        choices: [
          {
            t: "Tặng ly trà đào an ủi",
            h: "tốn 5k, Trúc cảm động vẽ tặng quán 1 bức tranh!",
            fn: () => {
              this.money -= 5000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.05);
              snd.playServeSuccess();
              this.showToast("Trúc cảm động vẽ tặng quán bức tranh cực nghệ thuật! (+⭐)");
            }
          },
          {
            t: "Cho mượn máy sấy tóc",
            h: "sấy khô giấy vẽ cấp tốc",
            fn: () => {
              this.paused = false;
              this.showToast("Giấy vẽ đã khô ráo, Trúc cười tươi tiếp tục vẽ!");
            }
          },
          {
            t: "Kệ khách tự lau chùi",
            h: "Trúc buồn bã thu dọn đồ đi về",
            fn: () => {
              this.paused = false;
              this.showToast("Trúc buồn thiu cất màu vẽ rồi thanh toán ra về");
            }
          }
        ]
      },
      // SỰ KIỆN 8: ANH ĐỨC CODER LỠ TAY DROP DATABASE
      {
        avatar: "images/avatar_anh_duc.jpg",
        tag: "DÂN IT VĂN PHÒNG",
        title: "Anh Đức hét toáng: 'Chết rồi lỡ xóa Database!'",
        text: "Anh Đức vừa nhâm nhi đen đá vừa gõ code, chẳng may enter nhầm lệnh xóa sạch dữ liệu công ty, mặt cắt không còn giọt máu!",
        choices: [
          {
            t: "Pha ly cà phê muối gấp đôi cafein",
            h: "tốn 5k, Đức tỉnh táo gõ lệnh cứu vãn kịp thời!",
            fn: () => {
              this.money -= 5000;
              this.paused = false;
              this.money += 30000;
              snd.playCoin();
              this.showToast("Cà phê muối cực đỉnh giúp Đức rollback dữ liệu thành công, tip 30k!");
            }
          },
          {
            t: "Khuyên Đức rút phích cắm trốn",
            h: "Đức hoảng loạn chạy mất, quên trả tiền nước",
            fn: () => {
              this.money -= 15000;
              this.paused = false;
              snd.playServeFail();
              this.showToast("Đức ôm laptop chạy thục mạng, quỵt luôn 15k ly đen đá!");
            }
          },
          {
            t: "Nhắc Đức thở sâu bình tĩnh",
            h: "Đức tìm được file backup lúc sáng",
            fn: () => {
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.03);
              this.showToast("Đức thở phào nhẹ nhõm: 'May quá có bản backup!' (+⭐)");
            }
          }
        ]
      },
      // SỰ KIỆN 9: CÔ HÀ LÙNG MÈO MƯỚP
      {
        avatar: "images/avatar_co_ha.jpg",
        tag: "CHUYỆN XÓM GIỀNG",
        title: "Cô Hà cầm chảo đi lùng mèo mướp",
        text: "Con mèo mướp tam thể nhà cô Hà chạy sang trèo tót lên mái hiên của quán, kêu 'meo meo' không chịu chịu xuống.",
        choices: [
          {
            t: "Lấy đĩa cá khô ra dụ mèo",
            h: "tốn 8k, cô Hà mừng rỡ mua ủng hộ 4 ly mang về!",
            fn: () => {
              this.money += (60000 - 8000);
              this.paused = false;
              snd.playCoin();
              this.showToast("Mèo nhảy xuống tay cô Hà! Cô hào phóng mua 4 ly cà phê mang về (+60k)!");
            }
          },
          {
            t: "Bắc thang trèo lên bế mèo",
            h: "hên xui trầy tay hoặc bắt được ngay",
            fn: () => {
              this.paused = false;
              if (Math.random() < 0.6) {
                this.rating = Math.min(5.0, this.rating + 0.05);
                this.showToast("Bế được mèo con trao tận tay cô Hà, cả xóm vỗ tay! (+⭐)");
              } else {
                this.money -= 10000;
                this.showToast("Mèo cào nhẹ vào tay làm đổ khay đá, tốn 10k mua băng cá nhân!");
              }
            }
          },
          {
            t: "Để mèo ngủ trên mái hiên",
            h: "khách thấy đáng yêu thi nhau chụp ảnh check-in",
            fn: () => {
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.04);
              this.showToast("Mèo ngủ ngon lành trên mái hiên, khách chụp ảnh review rần rần! (+⭐)");
            }
          }
        ]
      },
      // SỰ KIỆN 10: BÁC NĂM VÀ BÁC BẢY ĐÁNH CỜ ĐẬP BÀN
      {
        avatar: "images/avatar_chu_ba.jpg",
        tag: "TRANH CÃI NẢY LỬA",
        title: "Bác Năm và Bác Bảy tranh cãi cờ tướng",
        text: "Bác Năm lỡ tay đi nhầm nước cờ Mã đòi đi lại, bác Bảy không chịu đập bàn cạch cạch: 'Cờ xuất tay không hoàn!'",
        choices: [
          {
            t: "Mời mỗi bác một ly trà đá mát rượi",
            h: "tốn 4k, hai bác hạ hỏa cười xòa",
            fn: () => {
              this.money -= 4000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.04);
              this.showToast("Uống trà đá hạ hỏa, hai bác cười xòa xếp lại bàn cờ mới! (+⭐)");
            }
          },
          {
            t: "Đứng ra làm trọng tài phân xử",
            h: "bác Năm dỗi thua nhưng vẫn trả tiền 2 ly 30k",
            fn: () => {
              this.money += 30000;
              this.paused = false;
              snd.playCoin();
              this.showToast("Bác Năm chịu thua trả 30k tiền nước, hẹn mai phục thù!");
            }
          },
          {
            t: "Kệ hai bác tranh luận",
            h: "bàn bên cạnh giật mình vì tiếng đập bàn",
            fn: () => {
              this.seats.forEach(s => { if (s.customer) s.customer.patience -= 8; });
              this.paused = false;
              this.showToast("Tiếng đập bàn làm khách xung quanh hơi sốt ruột");
            }
          }
        ]
      },
      // SỰ KIỆN 11: BẢO NGỌC TIKTOKER LIVESTREAM REVIEW
      {
        avatar: "images/avatar_kha_ngan.jpg",
        tag: "TIKTOK REVIEWER",
        title: "Bảo Ngọc bật đèn livestream 'Hello cả nhà iu!'",
        text: "Hot girl Bảo Ngọc dựng chân máy bật đèn tròn hắt sáng chói lóa góc quán, chuẩn bị review món Cà phê muối béo ngậy.",
        choices: [
          {
            t: "Decor ly nước thật lộng lẫy bằng lá bạc hà",
            h: "tốn 5k hoa quả, video lên xu hướng triệu view!",
            fn: () => {
              this.money += (50000 - 5000);
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.08);
              snd.playServeSuccess();
              snd.playCoin();
              this.showToast("Clip lên xu hướng 1 triệu view! Khách ùa tới quán nườm nượp (+50k, +⭐)!");
            }
          },
          {
            t: "Tặng thêm đĩa bánh sừng bò ăn kèm",
            h: "tốn 8k, idol khen quán nức nở trên sóng",
            fn: () => {
              this.money -= 8000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.06);
              this.showToast("Bảo Ngọc khen bánh ngon ngất ngây, fan thả tim tới tấp! (+⭐)");
            }
          },
          {
            t: "Nhắc vặn nhỏ đèn hắt sáng đỡ chói mắt khách khác",
            h: "Bảo Ngọc hiểu ý vặn đèn dịu lại",
            fn: () => {
              this.paused = false;
              this.showToast("Bảo Ngọc vặn nhỏ đèn lại, không gian quán trở lại êm đềm");
            }
          }
        ]
      },
      // SỰ KIỆN 12: DUY KHOA TỎ TÌNH THẤT BẠI
      {
        avatar: "images/avatar_hoang_bach.jpg",
        tag: "DRAMA TÌNH CẢM",
        title: "Duy Khoa tỏ tình bị từ chối: 'Em xem anh như anh trai!'",
        text: "Duy Khoa vừa quỳ gối tặng bó hoa hồng thì bạn gái buông câu phũ phàng. Cả quán nín thở sững sờ.",
        choices: [
          {
            t: "Tặng Khoa ly cacao nóng ngọt ngào",
            h: "tốn 5k, Khoa xúc động vì sự ấm áp của quán",
            fn: () => {
              this.money += (25000 - 5000);
              this.paused = false;
              snd.playCoin();
              this.showToast("Khoa rưng rưng cảm ơn sự tử tế của chủ quán, tip lại 25k!");
            }
          },
          {
            t: "Bật bài hát thất tình an ủi",
            h: "Khoa khóc nức nở, cả quán vỗ tay động viên",
            fn: () => {
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.04);
              this.showToast("Nhạc nổi lên, cả quán vỗ vai động viên: 'Cố lên người anh em!' (+⭐)");
            }
          },
          {
            t: "Giả vờ cúi xuống lau bàn cho bạn đỡ ngượng",
            h: "Khoa ôm bó hoa lủi thủi ra về trong im lặng",
            fn: () => {
              this.paused = false;
              this.showToast("Khoa lặng lẽ thanh toán tiền nước rồi bước vội ra phố");
            }
          }
        ]
      },
      // SỰ KIỆN 13: SHIPPER HẢI ĐĂNG CẦM NHẦM LY
      {
        avatar: "images/avatar_anh_duc.jpg",
        tag: "SỰ CỐ GIAO HÀNG",
        title: "Shipper Hải Đăng cầm nhầm ly của bàn số 1",
        text: "Hải Đăng chạy vội vào quán bê luôn ly trà sen vàng của khách đang ngồi bàn số 1 định bỏ vào giỏ hàng giao đi.",
        choices: [
          {
            t: "Gọi với lại và pha nhanh ly mới cho shipper",
            h: "tốn 6k nguyên liệu, shipper cảm kích cúi đầu cảm ơn",
            fn: () => {
              this.money -= 6000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.04);
              this.showToast("Shipper kịp giờ giao hàng, khách bàn 1 khen quán nhanh trí! (+⭐)");
            }
          },
          {
            t: "Nhắc shipper kiểm tra lại mã đơn hàng",
            h: "Đăng đặt lại ly nước xuống bàn xin lỗi rối rít",
            fn: () => {
              this.paused = false;
              this.showToast("Hải Đăng gãi đầu xin lỗi: 'Em vội quá hoa cả mắt!'");
            }
          },
          {
            t: "Phạt shipper mua ly đó luôn 28k",
            h: "thu tiền ngay 28k",
            fn: () => {
              this.money += 28000;
              this.paused = false;
              snd.playCoin();
              this.showToast("Shipper đành uống ly đó rồi chờ pha đơn mới (+28k)");
            }
          }
        ]
      },
      // SỰ KIỆN 14: QUANG HUY GẢY GUITAR ACOUSTIC
      {
        avatar: "images/avatar_tuan_anh.jpg",
        tag: "BIỂU DIỄN VỈA HÈ",
        title: "Quang Huy xin phép gảy đàn vài khúc nhạc Trịnh",
        text: "Quang Huy mang cây đàn gỗ ngồi góc vỉa hè gảy khúc dạo đầu 'Mưa Hồng' cực kỳ êm dịu, khách xung quanh thích thú lắng nghe.",
        choices: [
          {
            t: "Mời Huy hát giao lưu cùng cả quán",
            h: "khách đi đường dừng lại đông nghẹt, doanh thu tăng vọt!",
            fn: () => {
              this.money += 45000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.07);
              snd.playServeSuccess();
              snd.playCoin();
              this.showToast("Khách đi đường xúm lại nghe đàn và gọi nước uống đông đúc (+45k, +⭐)!");
            }
          },
          {
            t: "Tặng Huy một ly cà phê đen nóng",
            h: "tốn 4k, Huy cảm ơn và hát tặng quán bài hát độc quyền",
            fn: () => {
              this.money -= 4000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.05);
              this.showToast("Huy uống cà phê ấm giọng hát bài 'Tiệm Cà Phê Nhỏ' quá tuyệt! (+⭐)");
            }
          },
          {
            t: "Nhắc gảy nhỏ tiếng giữ yên tĩnh",
            h: "Huy gảy ngón nhè nhẹ không lời",
            fn: () => {
              this.paused = false;
              this.showToast("Tiếng guitar mộc mạc làm nền du dương cho quán cà phê");
            }
          }
        ]
      },
      // SỰ KIỆN 15: PHƯƠNG LINH ĐỂ QUÊN VÍ
      {
        avatar: "images/avatar_minh_thu.jpg",
        tag: "KHÁCH QUÊN TIỀN",
        title: "Phương Linh hốt hoảng: 'Em để quên ví ở công ty!'",
        text: "Linh uống xong ly bạc xỉu 25k, mở túi xách mới phát hiện điện thoại sập nguồn còn ví thì bỏ quên ở bàn làm việc.",
        choices: [
          {
            t: "Cho Linh ghi sổ nợ hôm sau trả",
            h: "hôm sau Linh quay lại mua thêm 4 ly cho bạn cùng phòng!",
            fn: () => {
              this.money += 65000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.05);
              snd.playCoin();
              this.showToast("Linh quay lại thanh toán và mua thêm 4 ly cho đồng nghiệp (+65k, +⭐)!");
            }
          },
          {
            t: "Cho mượn sạc dự phòng bật nguồn chuyển khoản",
            h: "Linh bật máy chuyển khoản ngay 25k kèm tip 10k",
            fn: () => {
              this.money += 35000;
              this.paused = false;
              snd.playCoin();
              this.showToast("Linh chuyển khoản 35k kèm lời cảm ơn chủ quán chu đáo!");
            }
          },
          {
            t: "Giữ lại thẻ nhân viên làm tin",
            h: "Linh vội chạy về lấy tiền quay lại trả",
            fn: () => {
              this.money += 25000;
              this.paused = false;
              snd.playCoin();
              this.showToast("Linh đem tiền sang trả 25k đầy đủ");
            }
          }
        ]
      },
      // SỰ KIỆN 16: THẢO MY HỌC SINH LÀM ĐỔ LY NƯỚC
      {
        avatar: "images/avatar_thanh_truc.jpg",
        tag: "SỰ CỐ BẤT CẨN",
        title: "Bé Thảo My vấp chân bàn làm đổ ly kem muối",
        text: "Bé My vừa bưng ly matcha kem muối thì vấp phải chân bàn làm đổ lênh láng ra sàn gạch, rơm rớm nước mắt vì tiếc.",
        choices: [
          {
            t: "Lau sàn và pha ngay ly mới tặng bé",
            h: "tốn 6k, mẹ bé đi cùng cảm kích tip 35k khen quán có tâm!",
            fn: () => {
              this.money += (35000 - 6000);
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.06);
              snd.playCoin();
              this.showToast("Mẹ bé xúc động khen chủ quán tử tế, tip nóng 35k! (+⭐)");
            }
          },
          {
            t: "Đưa khăn lau cho bé tự lau rồi giảm giá 50% ly mới",
            h: "thu 18k ly mới",
            fn: () => {
              this.money += 18000;
              this.paused = false;
              snd.playCoin();
              this.showToast("Bé My ngoan ngoãn lau bàn và nhận ly mới vui vẻ (+18k)");
            }
          },
          {
            t: "Chỉ lau sàn và không hỗ trợ thêm",
            h: "bé My tiếc nuối ngồi uống cốc trà đá miễn phí",
            fn: () => {
              this.paused = false;
              this.showToast("Sàn nhà được lau sạch sẽ, bé My ngồi uống trà đá");
            }
          }
        ]
      },
      // SỰ KIỆN 17: CHỊ MAI BÁN HOA TẶNG HOA THẠCH THẢO
      {
        avatar: "images/avatar_co_ha.jpg",
        tag: "QUÀ TẶNG BẤT NGỜ",
        title: "Chị Mai bán hoa dạo ghé tặng bó hoa thạch thảo",
        text: "Chị Mai đẩy xe hoa ngang qua, thấy quán cà phê phong cách mộc mạc dễ thương liền tặng một bó hoa tím cắm lọ.",
        choices: [
          {
            t: "Mời chị Mai ly nước mát giải nhiệt",
            h: "tốn 4k, quán xinh xắn ngát hương hoa, khách khen nức nở",
            fn: () => {
              this.money -= 4000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.05);
              snd.playServeSuccess();
              this.showToast("Bình hoa thạch thảo cắm trên bàn gỗ xinh xắn, khách khen quán có gu! (+⭐)");
            }
          },
          {
            t: "Mua ủng hộ thêm 2 bó hoa hồng để decor bàn",
            h: "tốn 25k, các bàn khách ngập tràn sắc hoa rực rỡ",
            fn: () => {
              this.money -= 25000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.08);
              this.showToast("Bàn nào cũng có hoa tươi, khách nữ thi nhau chụp hình check-in! (+⭐)");
            }
          },
          {
            t: "Cảm ơn chị Mai và đặt lọ hoa lên quầy",
            h: "quầy pha chế thêm nét duyên dáng",
            fn: () => {
              this.paused = false;
              this.showToast("Quầy pha chế thơm hương hoa thạch thảo dịu dàng");
            }
          }
        ]
      },
      // SỰ KIỆN 18: TRỌNG HIẾU ĐÒI PHA BỘT WHEY VÀO CÀ PHÊ
      {
        avatar: "images/avatar_hoang_bach.jpg",
        tag: "YÊU CẦU OÁI OĂM",
        title: "Trọng Hiếu rút hũ bột Whey Protein to đùng ra quầy",
        text: "Chàng gymer Trọng Hiếu cơ bắp cuồn cuộn nhờ quán pha 1 muỗng bột Whey vị socola vào ly cà phê đen đá để 'siết cơ'.",
        choices: [
          {
            t: "Lắc kỹ bằng bình shaker cho tan mịn",
            h: "Hiếu mê tít, rủ cả đội phòng gym 6 người sang ủng hộ!",
            fn: () => {
              this.money += 80000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.06);
              snd.playCoin();
              snd.playServeSuccess();
              this.showToast("Ly Cà Phê Whey đỉnh chóp! Hiếu rủ cả hội gymer ùa sang uống (+80k, +⭐)!");
            }
          },
          {
            t: "Phụ thu 5k phí pha đồ ngoài",
            h: "Hiếu vui vẻ trả thêm 5k",
            fn: () => {
              this.money += 20000;
              this.paused = false;
              snd.playCoin();
              this.showToast("Hiếu thanh toán 20k ly cà phê lắc bột protein ngon lành");
            }
          },
          {
            t: "Từ chối vì sợ ám mùi bình lắc",
            h: "Hiếu hơi buồn đành gọi ly cà phê đen đá truyền thống",
            fn: () => {
              this.money += 15000;
              this.paused = false;
              snd.playCoin();
              this.showToast("Hiếu uống ly đen đá truyền thống rồi đi tập gym");
            }
          }
        ]
      },
      // SỰ KIỆN 19: THÙY TRANG ĐÁNH RƠI BÔNG TAI
      {
        avatar: "images/avatar_ngoc_diep.jpg",
        tag: "TÌM ĐỒ THẤT LẠC",
        title: "Thùy Trang hốt hoảng vì rơi chiếc bông tai kỷ niệm",
        text: "Trang uống ly trà vải tuyết xong thì phát hiện rơi mất chiếc bông tai kỷ niệm dưới khe bàn ghế vỉa hè.",
        choices: [
          {
            t: "Bật đèn pin điện thoại soi kỹ từng khe gạch tìm giúp",
            h: "tìm thấy bông tai dưới chân ghế, Trang mừng rỡ tip nóng 50k!",
            fn: () => {
              this.money += 50000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.06);
              snd.playCoin();
              snd.playServeSuccess();
              this.showToast("Tìm thấy bông tai nguyên vẹn! Trang xúc động tip ngay 50k (+50k, +⭐)!");
            }
          },
          {
            t: "Mời các bàn xung quanh nhấc nhẹ chân để tìm",
            h: "tìm được đồ, quán được khen nhiệt tình hết nấc",
            fn: () => {
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.05);
              this.showToast("Cả quán cùng vui mừng khi tìm lại được kỷ vật cho bạn nữ! (+⭐)");
            }
          },
          {
            t: "Để khách tự tìm vì quầy đang bận pha chế",
            h: "Trang tìm không thấy ngậm ngùi ra về",
            fn: () => {
              this.paused = false;
              this.showToast("Trang tiếc nuối thanh toán tiền nước rồi ra về");
            }
          }
        ]
      },
      // SỰ KIỆN 20: VĂN HÙNG KỸ SƯ CẮM SẠC DÀN PIN FLYCAM
      {
        avatar: "images/avatar_tuan_anh.jpg",
        tag: "KHÁCH CÔNG NGHỆ",
        title: "Văn Hùng cắm 4 cục sạc Flycam làm nóng rực ổ điện",
        text: "Kỹ sư Hùng vừa đi khảo sát bay flycam về, cắm nguyên dàn sạc nhanh công suất lớn làm dây điện bốc mùi ấm ấm.",
        choices: [
          {
            t: "Nhắc anh Hùng sạc từng cục một cho an toàn",
            h: "anh Hùng cảm ơn vì nhắc nhở an toàn, boa thêm 20k!",
            fn: () => {
              this.money += 20000;
              this.paused = false;
              snd.playCoin();
              this.showToast("Anh Hùng vui vẻ cắm 1 cục, boa thêm 20k tiền điện quán!");
            }
          },
          {
            t: "Trang bị ổ cắm chịu tải cao cho quán",
            h: "tốn 15k, khách công nghệ khen quán trang bị hiện đại",
            fn: () => {
              this.money -= 15000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.05);
              this.showToast("Ổ cắm chịu tải cực tốt, an toàn tuyệt đối (+⭐)!");
            }
          },
          {
            t: "Rút phích cắm ra vì sợ nhảy cầu dao tổng",
            h: "anh Hùng đành cất bớt đồ sạc vào balo",
            fn: () => {
              this.paused = false;
              this.showToast("Hệ thống điện an toàn, anh Hùng uống nốt ly cà phê");
            }
          }
        ]
      },
      // SỰ KIỆN 21: THANH NIÊN PHÁT TỜ RƠI DẠO
      {
        avatar: "images/avatar_chu_ba.jpg",
        tag: "TIẾP THỊ ĐƯỜNG PHỐ",
        title: "Thanh niên rải tờ rơi 'Niềng răng trả góp' kín từng bàn",
        text: "Một bạn nam chạy xe tới nhét xấp tờ rơi quảng cáo nha khoa lên khắp các mặt bàn khách đang uống cà phê.",
        choices: [
          {
            t: "Gom lại gọn gàng và tặng bạn ấy ly trà đá giải nhiệt",
            h: "tốn 2k, bạn trẻ cảm ơn và không rải nữa, khách khen lịch thiệp",
            fn: () => {
              this.money -= 2000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.04);
              this.showToast("Bạn phát tờ rơi cảm ơn rối rít dọn sạch, khách khen chủ quán nhân hậu! (+⭐)");
            }
          },
          {
            t: "Nhắc nhở nhẹ nhàng không rải vào quán",
            h: "bạn thanh niên thu lại tờ rơi rồi đi ngõ khác",
            fn: () => {
              this.paused = false;
              this.showToast("Bàn ghế vỉa hè sạch sẽ, tinh tươm trở lại");
            }
          },
          {
            t: "Kệ tờ rơi trên bàn",
            h: "gió thổi bay tờ rơi lộn xộn ra hè phố",
            fn: () => {
              this.paused = false;
              this.showToast("Gió cuốn vài tờ rơi bay sang nhà bên cạnh");
            }
          }
        ]
      },
      // SỰ KIỆN 22: BÀ CỤ BÁN VÉ SỐ DẠO
      {
        avatar: "images/avatar_co_ha.jpg",
        tag: "ĐẶC TRƯNG VỈA HÈ",
        title: "Bà cụ bán vé số: 'Mua ủng hộ bà cặp vé chiều trúng độc đắc'",
        text: "Bà cụ tóc bạc phơ bước chậm rãi qua quán mời khách mua vé số đài chiều nay xổ số.",
        choices: [
          {
            t: "Mua ủng hộ bà 2 tờ vé số 20k",
            h: "tốn 20k, chiều bất ngờ dò trúng giải may mắn 80k!",
            fn: () => {
              this.money += (80000 - 20000);
              this.paused = false;
              snd.playCoin();
              snd.playServeSuccess();
              this.showToast("Chiều dò số bất ngờ trúng giải may mắn 80k! Lời to (+60k)!");
            }
          },
          {
            t: "Mời bà cụ ly nước mía mát lạnh giải lao",
            h: "tốn 3k, bà cảm ơn chúc quán buôn may bán đắt, khách ấm lòng",
            fn: () => {
              this.money -= 3000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.05);
              this.showToast("Bà cụ cười hiền chúc quán phúc lộc đầy nhà! (+⭐)");
            }
          },
          {
            t: "Lắc đầu từ chối lịch sự",
            h: "bà cụ vui vẻ bước sang con ngõ kế tiếp",
            fn: () => {
              this.paused = false;
              this.showToast("Bà cụ chào rồi tiếp tục hành trình trên phố");
            }
          }
        ]
      },
      // SỰ KIỆN 23: BA CHÚ MÈO CON QUẤN QUÝT CHÂN KHÁCH
      {
        avatar: "images/avatar_minh_thu.jpg",
        tag: "HIỆU ỨNG ĐÁNG YÊU",
        title: "Đàn mèo con 3 đứa chạy lon ton vào quán",
        text: "Ba chú mèo con lông vàng óng chạy vào cọ cọ quanh chân bàn khách khiến các bạn nữ xuýt xoa 'Cưng xỉu!'.",
        choices: [
          {
            t: "Rót chén sữa tươi nhỏ cho mèo con uống",
            h: "tốn 4k sữa, mèo ngồi ngoan, khách chụp ảnh đăng story rần rần!",
            fn: () => {
              this.money -= 4000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.06);
              snd.playServeSuccess();
              this.showToast("Khách thi nhau quay video mèo uống sữa đăng TikTok, quán nổi tiếng! (+⭐)");
            }
          },
          {
            t: "Đặt một chiếc hộp carton lót khăn cho mèo nằm ngủ",
            h: "mèo ngủ ngoan một góc, không gian cực kỳ chill",
            fn: () => {
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.04);
              this.showToast("Quán cà phê có mèo ngủ êm đềm, khách khen hết lời! (+⭐)");
            }
          },
          {
            t: "Xua nhẹ mèo ra phía hiên ngoài",
            h: "đảm bảo vệ sinh cho quầy pha chế",
            fn: () => {
              this.paused = false;
              this.showToast("Mèo con lon ton chạy ra chơi ngoài hiên nắng");
            }
          }
        ]
      },
      // SỰ KIỆN 24: HAI BẠN TÂY BALO ĐI LẠC HỎI ĐƯỜNG
      {
        avatar: "images/avatar_ngoc_diep.jpg",
        tag: "KHÁCH NGOẠI QUỐC",
        title: "Khách du lịch Tây balo hỏi đường đến Chợ Bến Thành",
        text: "Hai bạn trẻ ngoại quốc cầm bản đồ đi lạc ghé vào quán, vừa tò mò nhìn ly cà phê phin truyền thống giọt giọt nhỏ xuống.",
        choices: [
          {
            t: "Bắn tiếng Anh chỉ đường + mời thử 2 ly Cà Phê Trứng",
            h: "hai bạn mê mẩn hương vị Việt Nam, trả bằng tiền USD tip hào phóng 70k!",
            fn: () => {
              this.money += 70000;
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.08);
              snd.playCoin();
              snd.playServeSuccess();
              this.showToast("Khách Tây thốt lên: 'Amazing Vietnamese Coffee!', tip hào phóng 70k (+70k, +⭐)!");
            }
          },
          {
            t: "Vẽ bản đồ chỉ đường chi tiết ra khăn giấy cho khách",
            h: "hai bạn Tây cúi đầu cảm ơn 'You are awesome!'",
            fn: () => {
              this.paused = false;
              this.rating = Math.min(5.0, this.rating + 0.05);
              this.showToast("Khách Tây vui vẻ chụp ảnh kỷ niệm cùng quán rồi lên đường! (+⭐)");
            }
          },
          {
            t: "Mở Google Maps chỉ hướng đi thẳng",
            h: "hai bạn tìm được đúng đường ra trung tâm",
            fn: () => {
              this.paused = false;
              this.showToast("Hai bạn Tây vẫy tay chào tạm biệt: 'Thank you so much!'");
            }
          }
        ]
      }
    ];

    const ev = events[Math.floor(Math.random() * events.length)];
    this.triggerDrama(ev);
  }
}

// Khởi động khi tải xong DOM
window.addEventListener("DOMContentLoaded", () => {
  window.game = new GameEngine();
});
