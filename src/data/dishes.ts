import type { Dish } from "@/types";
import banh_trung_thuImage from "@/assets/soi-banh/banh_trung_thu.jpg";
import banh_miImage from "@/assets/soi-banh/banh_mi.jpg";
import banh_xeoImage from "@/assets/soi-banh/banh_xeo.jpg";
import banh_khotImage from "@/assets/soi-banh/banh_khot.jpg";
import banh_bot_locImage from "@/assets/soi-banh/banh_bot_loc.jpg";
import banh_da_lonImage from "@/assets/soi-banh/banh_da_lon.jpg";
import banh_boImage from "@/assets/soi-banh/banh_bo.jpg";
import banh_congImage from "@/assets/soi-banh/banh_cong.jpg";
import banh_tieuImage from "@/assets/soi-banh/banh_tieu.jpg";
import banh_tai_heoImage from "@/assets/soi-banh/banh_tai_heo.jpg";

const dishImages: Record<string, string> = {
  banh_trung_thu: banh_trung_thuImage,
  banh_mi: banh_miImage,
  banh_xeo: banh_xeoImage,
  banh_khot: banh_khotImage,
  banh_bot_loc: banh_bot_locImage,
  banh_da_lon: banh_da_lonImage,
  banh_bo: banh_boImage,
  banh_cong: banh_congImage,
  banh_tieu: banh_tieuImage,
  banh_tai_heo: banh_tai_heoImage,
};

type DishInput = Omit<Dish, "image">;
const defineDish = (dish: DishInput): Dish => ({ ...dish, image: dishImages[dish.slug] ?? "" });

export const dishes: Dish[] = [
  defineDish({
    slug: "banh_trung_thu", nameVi: "Bánh trung thu", nameEn: "Vietnamese mooncake", tags: ["Ngọt"],
    summary: "Bánh nướng hoặc bánh dẻo thường được ăn vào dịp Tết Trung thu.",
    origin: "Bánh trung thu có nhiều biến thể ở Việt Nam và các nước trong khu vực. Ở Việt Nam, bánh nướng và bánh dẻo thường xuất hiện vào dịp rằm tháng Tám.",
    flavor: "Bánh nướng thường đậm vị, hơi mặn ngọt và có nhân béo. Bánh dẻo mềm, thơm và ngọt rõ hơn.",
    flavorProfile: { sweet: 4, salty: 2, rich: 4, crunchy: 1 },
    whereToEat: { region: "Tiệm bánh và quầy bánh Trung thu ở nhiều tỉnh thành.", bestTime: "Mùa Trung thu, hoặc dùng cùng trà vào buổi chiều.", tip: "Cắt bánh thành miếng nhỏ và thử cùng trà nóng để vị ngọt dịu hơn." },
    funFacts: ["Bánh nướng có lớp vỏ được nướng vàng và thường có hoa văn trên mặt.", "Bánh dẻo có lớp vỏ làm từ bột nếp chín, không cần nướng.", "Nhân bánh có thể gồm đậu, hạt, trứng muối hoặc nhiều nguyên liệu khác."],
    ingredients: [{ name: "Bột mì", amount: "250 g" }, { name: "Nước đường bánh nướng", amount: "170 ml" }, { name: "Dầu ăn", amount: "40 ml" }, { name: "Nhân đậu xanh", amount: "400 g" }, { name: "Lòng đỏ trứng muối", amount: "4 cái" }, { name: "Bột bánh dẻo", amount: "1 thìa cà phê" }, { name: "Nước tro tàu", amount: "1/2 thìa cà phê" }],
    steps: ["Trộn nước đường, dầu ăn và nước tro tàu.", "Cho bột mì vào, trộn vừa hòa quyện rồi để bột nghỉ.", "Chia nhân đậu xanh và đặt trứng muối vào giữa.", "Chia bột vỏ và bọc kín từng viên nhân.", "Phủ bột khuôn rồi ép bánh thành hình.", "Nướng bánh khoảng 10 phút ở 180°C.", "Lấy bánh ra, quét trứng mỏng rồi nướng thêm đến khi vàng."], cookTime: 75, servings: 4, difficulty: "Khó",
  }),
  defineDish({
    slug: "banh_mi", nameVi: "Bánh mì", nameEn: "Vietnamese baguette", tags: ["Mặn"],
    summary: "Ổ bánh mì giòn kẹp nhân mặn, rau thơm và đồ chua.",
    origin: "Bánh mì Việt Nam phát triển từ ổ bánh mì kiểu Pháp và được biến đổi với nguyên liệu, cách nêm nếm địa phương.",
    flavor: "Vỏ bánh giòn, ruột mềm. Nhân có thể mặn, béo, chua nhẹ và thơm mùi rau.",
    flavorProfile: { sweet: 1, salty: 4, rich: 3, crunchy: 4 },
    whereToEat: { region: "Xe bánh mì bên đường và tiệm bánh mì ở hầu hết tỉnh thành.", bestTime: "Bữa sáng hoặc bữa xế.", tip: "Hỏi trước về ớt và nước sốt nếu bạn muốn vị nhẹ." },
    funFacts: ["Nhân bánh mì thay đổi theo vùng và từng quầy.", "Đồ chua thường cân bằng vị béo của pa-tê hoặc thịt.", "Một ổ bánh mì có thể gọn để mang đi ăn khi dạo phố."],
    ingredients: [{ name: "Ổ bánh mì", amount: "4 ổ" }, { name: "Pa-tê", amount: "120 g" }, { name: "Thịt nguội", amount: "160 g" }, { name: "Dưa leo", amount: "1 quả" }, { name: "Cà rốt", amount: "1 củ" }, { name: "Củ cải trắng", amount: "100 g" }, { name: "Ngò rí", amount: "1 nắm" }, { name: "Nước mắm", amount: "2 thìa canh" }],
    steps: ["Bào sợi cà rốt và củ cải.", "Trộn rau củ với giấm, đường và chút muối.", "Rửa sạch ngò rí và cắt dưa leo thành thanh.", "Làm nóng bánh mì cho vỏ giòn.", "Rạch bánh và phết pa-tê vào ruột.", "Xếp thịt nguội, dưa leo, đồ chua và ngò rí.", "Rưới ít nước mắm hoặc sốt rồi dùng ngay."], cookTime: 30, servings: 4, difficulty: "Dễ",
  }),
  defineDish({
    slug: "banh_xeo", nameVi: "Bánh xèo", nameEn: "Crispy Vietnamese pancake", tags: ["Mặn"],
    summary: "Bánh áp chảo vàng giòn, thường có tôm, thịt và giá đỗ.",
    origin: "Bánh xèo phổ biến ở nhiều vùng miền. Kích thước, độ giòn và cách ăn thay đổi theo địa phương.",
    flavor: "Vỏ bánh giòn, hơi béo và có mùi nghệ. Nhân tôm thịt mặn nhẹ, ăn cùng rau và nước chấm.",
    flavorProfile: { sweet: 1, salty: 3, rich: 3, crunchy: 4 },
    whereToEat: { region: "Quán bánh xèo ở miền Nam, miền Trung và nhiều thành phố lớn.", bestTime: "Bữa trưa hoặc tối, khi bánh vừa đổ xong.", tip: "Cuốn một miếng bánh với rau sống rồi chấm nước mắm pha." },
    funFacts: ["Tên bánh thường được liên hệ với tiếng xèo khi đổ bột vào chảo nóng.", "Một số nơi làm bánh nhỏ và giòn, nơi khác làm bánh lớn mềm hơn.", "Rau ăn kèm có thể gồm nhiều loại lá địa phương."],
    ingredients: [{ name: "Bột gạo", amount: "200 g" }, { name: "Nước cốt dừa", amount: "100 ml" }, { name: "Nước", amount: "250 ml" }, { name: "Bột nghệ", amount: "1/2 thìa cà phê" }, { name: "Tôm", amount: "200 g" }, { name: "Thịt ba chỉ", amount: "150 g" }, { name: "Giá đỗ", amount: "150 g" }, { name: "Hành lá", amount: "2 nhánh" }],
    steps: ["Khuấy bột gạo, nước, nước cốt dừa và nghệ.", "Để bột nghỉ khoảng 20 phút rồi trộn hành lá.", "Luộc sơ tôm và thái mỏng thịt ba chỉ.", "Làm nóng chảo, cho chút dầu rồi xếp tôm và thịt.", "Đổ một lớp bột mỏng quanh chảo.", "Thêm giá đỗ, đậy nắp đến khi bánh chín.", "Mở nắp và để bánh giòn rồi gập đôi."], cookTime: 45, servings: 4, difficulty: "Vừa",
  }),
  defineDish({
    slug: "banh_khot", nameVi: "Bánh khọt", nameEn: "Mini coconut rice pancakes", tags: ["Mặn"],
    summary: "Bánh nhỏ đổ trong khuôn, mặt thường có tôm và mỡ hành.",
    origin: "Bánh khọt phổ biến ở miền Nam, đặc biệt được biết đến tại vùng ven biển phía Nam. Nguồn gốc cụ thể có nhiều cách kể.",
    flavor: "Bánh có viền giòn, ruột mềm thơm nước cốt dừa. Tôm và nước chấm tạo vị mặn ngọt.",
    flavorProfile: { sweet: 2, salty: 3, rich: 4, crunchy: 3 },
    whereToEat: { region: "Quán bánh khọt ở Vũng Tàu và miền Tây.", bestTime: "Bữa sáng muộn hoặc bữa xế.", tip: "Ăn kèm rau sống và chấm nhẹ để bánh không bị ngấm mềm." },
    funFacts: ["Bánh được đổ trong khuôn nhiều lỗ nên mỗi chiếc khá nhỏ.", "Mỡ hành và tôm là phần phủ mặt thường gặp.", "Bánh khọt thường được dọn cùng rau và nước mắm pha."],
    ingredients: [{ name: "Bột gạo", amount: "200 g" }, { name: "Nước cốt dừa", amount: "180 ml" }, { name: "Nước", amount: "150 ml" }, { name: "Bột nghệ", amount: "1/3 thìa cà phê" }, { name: "Tôm nhỏ", amount: "250 g" }, { name: "Hành lá", amount: "3 nhánh" }, { name: "Dầu ăn", amount: "3 thìa canh" }, { name: "Nước mắm", amount: "3 thìa canh" }],
    steps: ["Khuấy bột gạo, nước, nước cốt dừa và nghệ.", "Để bột nghỉ 20 phút.", "Cắt hành lá và trộn với chút dầu nóng.", "Làm nóng khuôn, quét một lớp dầu mỏng.", "Đổ bột vào từng lỗ khuôn rồi đặt tôm lên trên.", "Đậy nắp đến khi bánh chín, mở nắp cho viền giòn.", "Rắc mỡ hành và lấy bánh ra dùng nóng."], cookTime: 40, servings: 4, difficulty: "Vừa",
  }),
  defineDish({
    slug: "banh_bot_loc", nameVi: "Bánh bột lọc", nameEn: "Clear tapioca dumplings", tags: ["Mặn"],
    summary: "Bánh bột năng trong dai, thường gói tôm thịt trong lá chuối.",
    origin: "Bánh bột lọc gắn với ẩm thực miền Trung, nhất là Huế. Có loại gói lá và loại trần không gói.",
    flavor: "Vỏ dai trong, nhân tôm thịt đậm đà. Bánh gói lá có thêm mùi thơm dịu của lá chuối.",
    flavorProfile: { sweet: 1, salty: 4, rich: 2, crunchy: 0 },
    whereToEat: { region: "Quán bánh Huế, hàng ăn vặt và chợ ở miền Trung.", bestTime: "Bữa xế hoặc món ăn nhẹ trong ngày.", tip: "Hỏi người bán loại bánh gói lá hay bánh trần và xin thêm nước mắm nếu thích đậm." },
    funFacts: ["Bột năng tạo lớp vỏ trong khi bánh chín.", "Bánh có thể được luộc trần hoặc hấp trong lá chuối.", "Tôm rim thường được giữ nguyên vỏ để màu nhân đẹp hơn."],
    ingredients: [{ name: "Bột năng", amount: "300 g" }, { name: "Tôm nhỏ", amount: "200 g" }, { name: "Thịt ba chỉ", amount: "150 g" }, { name: "Nước mắm", amount: "2 thìa canh" }, { name: "Đường", amount: "1 thìa canh" }, { name: "Dầu ăn", amount: "1 thìa canh" }, { name: "Lá chuối", amount: "8 miếng" }, { name: "Hành tím", amount: "2 củ" }],
    steps: ["Rim tôm và thịt với hành tím, nước mắm và đường.", "Đun nước với dầu đến khi nóng già.", "Rót nước nóng từ từ vào bột năng, trộn rồi nhồi thành khối.", "Chia bột thành miếng nhỏ và cán mỏng.", "Đặt nhân vào giữa, gấp mép bột thật kín.", "Gói bánh bằng lá chuối hoặc luộc bánh trần đến khi nổi.", "Vớt bánh, để ráo và dùng với nước mắm."], cookTime: 55, servings: 4, difficulty: "Vừa",
  }),
  defineDish({
    slug: "banh_da_lon", nameVi: "Bánh da lợn", nameEn: "Pandan layer cake", tags: ["Ngọt"],
    summary: "Bánh hấp nhiều lớp mềm dai, thường có lá dứa và đậu xanh.",
    origin: "Bánh da lợn phổ biến ở miền Nam và thường xuất hiện tại chợ, tiệm bánh hoặc dịp sum họp.",
    flavor: "Bánh mềm dai, thơm lá dứa và nước cốt dừa. Lớp đậu xanh bùi, vị ngọt vừa.",
    flavorProfile: { sweet: 4, salty: 0, rich: 4, crunchy: 0 },
    whereToEat: { region: "Quầy bánh ở chợ và tiệm bánh miền Nam.", bestTime: "Ăn nhẹ buổi chiều hoặc dùng tráng miệng.", tip: "Chờ bánh nguội rồi cắt bằng dao thoa chút dầu để mặt cắt gọn." },
    funFacts: ["Các lớp bánh được hấp nối tiếp nhau trong cùng một khuôn.", "Màu xanh thường đến từ lá dứa, còn lớp vàng có thể làm từ đậu xanh.", "Tên bánh gợi đến các lớp mỏng xếp chồng lên nhau."],
    ingredients: [{ name: "Bột năng", amount: "200 g" }, { name: "Bột gạo", amount: "50 g" }, { name: "Đậu xanh cà vỏ", amount: "100 g" }, { name: "Nước cốt dừa", amount: "250 ml" }, { name: "Đường", amount: "130 g" }, { name: "Nước lá dứa", amount: "120 ml" }, { name: "Muối", amount: "1/4 thìa cà phê" }],
    steps: ["Ngâm đậu xanh rồi hấp chín và nghiền mịn.", "Khuấy bột năng, bột gạo, đường, muối và nước cốt dừa.", "Chia hỗn hợp bột làm hai phần.", "Trộn một phần với đậu xanh, phần còn lại với nước lá dứa.", "Quét dầu vào khuôn và hấp nóng.", "Đổ một lớp bột mỏng, hấp đến se mặt rồi thêm lớp kế tiếp.", "Hấp chín hoàn toàn, để nguội rồi lấy bánh ra."], cookTime: 70, servings: 6, difficulty: "Vừa",
  }),
  defineDish({
    slug: "banh_bo", nameVi: "Bánh bò", nameEn: "Vietnamese honeycomb cake", tags: ["Ngọt"],
    summary: "Bánh lên men có ruột nhiều lỗ nhỏ, thường thơm dừa hoặc lá dứa.",
    origin: "Bánh bò có nhiều cách làm và biến thể ở miền Nam lẫn miền Trung. Một số loại được hấp, một số được nướng.",
    flavor: "Bánh mềm xốp, hơi dai và ngọt. Nước cốt dừa làm bánh thơm béo hơn.",
    flavorProfile: { sweet: 3, salty: 0, rich: 3, crunchy: 0 },
    whereToEat: { region: "Quầy bánh ở chợ và tiệm bánh miền Nam, miền Trung.", bestTime: "Bữa xế hoặc dùng cùng trà.", tip: "Chọn bánh còn mềm và hỏi xem bánh dùng nước cốt dừa hay không." },
    funFacts: ["Ruột bánh có nhiều lỗ khí nhỏ do bột được ủ.", "Bánh bò hấp thường có mặt xốp và không cần lò nướng.", "Lá dứa có thể tạo màu xanh và mùi thơm nhẹ."],
    ingredients: [{ name: "Bột gạo", amount: "200 g" }, { name: "Bột năng", amount: "50 g" }, { name: "Đường", amount: "120 g" }, { name: "Nước cốt dừa", amount: "180 ml" }, { name: "Men nở", amount: "5 g" }, { name: "Nước ấm", amount: "100 ml" }, { name: "Muối", amount: "1/4 thìa cà phê" }],
    steps: ["Hòa men với nước ấm và một thìa đường.", "Trộn bột gạo, bột năng và muối.", "Đun nhẹ nước cốt dừa với phần đường còn lại rồi để nguội.", "Trộn nước men và nước cốt dừa vào bột.", "Đậy kín và ủ đến khi mặt bột có bọt nhỏ.", "Rót bột vào khuôn đã làm nóng.", "Hấp bánh đến khi xiên tăm thấy khô."], cookTime: 60, servings: 6, difficulty: "Vừa",
  }),
  defineDish({
    slug: "banh_cong", nameVi: "Bánh cống", nameEn: "Mung bean shrimp fritter", tags: ["Mặn"],
    summary: "Bánh chiên trong khuôn sâu, thường có đậu xanh và tôm trên mặt.",
    origin: "Bánh cống phổ biến ở miền Tây Nam Bộ. Một số cách gọi và thành phần có thể khác nhau giữa các địa phương.",
    flavor: "Vỏ chiên vàng giòn, bên trong có đậu xanh bùi và nhân mặn. Rau sống giúp vị nhẹ hơn.",
    flavorProfile: { sweet: 1, salty: 3, rich: 3, crunchy: 4 },
    whereToEat: { region: "Quán ăn và hàng bánh ở Sóc Trăng, Cần Thơ và miền Tây.", bestTime: "Bữa xế hoặc bữa ăn nhẹ lúc bánh vừa chiên.", tip: "Ăn cùng rau sống và chấm nước mắm pha để cân bằng vị dầu." },
    funFacts: ["Khuôn sâu giúp bánh có hình trụ và giữ được phần nhân.", "Đậu xanh nguyên hạt thường được hấp sơ trước khi dim vào bánh.", "Tôm trên mặt bánh giúp người ăn nhìn thấy phần nhân."],
    ingredients: [{ name: "Bột gạo", amount: "200 g" }, { name: "Bột mì", amount: "50 g" }, { name: "Đậu xanh", amount: "100 g" }, { name: "Tôm", amount: "200 g" }, { name: "Thịt heo xay", amount: "100 g" }, { name: "Nước", amount: "280 ml" }, { name: "Hành lá", amount: "2 nhánh" }, { name: "Dầu ăn", amount: "500 ml" }],
    steps: ["Ngâm đậu xanh rồi hấp vừa chín.", "Khuấy bột gạo, bột mì và nước thành hỗn hợp sệt.", "Trộn thịt xay với hành lá và chút gia vị.", "Làm nóng dầu và nhúng khuôn vào dầu.", "Đổ một lớp bột vào khuôn rồi thêm đậu xanh và thịt.", "Phủ thêm bột, đặt tôm lên mặt và thả khuôn vào dầu.", "Chiên đến khi bánh vàng giòn rồi để ráo dầu."], cookTime: 50, servings: 4, difficulty: "Vừa",
  }),
  defineDish({
    slug: "banh_tieu", nameVi: "Bánh tiêu", nameEn: "Vietnamese sesame doughnut", tags: ["Ngọt"],
    summary: "Bánh bột chiên phồng, phủ mè và có ruột rỗng nhẹ.",
    origin: "Bánh tiêu là món bánh chiên phổ biến tại nhiều tỉnh thành. Công thức thường dùng bột mì và men nở.",
    flavor: "Vỏ bánh giòn nhẹ, ruột dai mềm và thơm mè. Bánh thường có vị ngọt vừa.",
    flavorProfile: { sweet: 2, salty: 0, rich: 2, crunchy: 3 },
    whereToEat: { region: "Xe bánh và quầy ăn vặt ở chợ, khu dân cư.", bestTime: "Buổi sáng hoặc bữa xế, khi bánh còn ấm.", tip: "Chọn bánh vừa chiên xong; để nguội lâu bánh sẽ bớt giòn." },
    funFacts: ["Bánh thường phồng lên khi gặp dầu nóng.", "Mè được ép lên mặt bột trước khi chiên.", "Một số người ăn bánh tiêu không nhân, nơi khác kẹp cùng bánh bò."],
    ingredients: [{ name: "Bột mì", amount: "300 g" }, { name: "Men nở", amount: "5 g" }, { name: "Đường", amount: "45 g" }, { name: "Nước ấm", amount: "170 ml" }, { name: "Mè trắng", amount: "50 g" }, { name: "Bột nở", amount: "1/2 thìa cà phê" }, { name: "Dầu ăn", amount: "500 ml" }],
    steps: ["Hòa men và một ít đường vào nước ấm.", "Trộn bột mì, bột nở và phần đường còn lại.", "Thêm nước men, nhồi đến khi bột mịn.", "Đậy bột và ủ đến khi nở gần gấp đôi.", "Chia bột thành viên rồi lăn qua mè.", "Cán viên bột thành miếng tròn dẹt.", "Chiên trong dầu nóng, trở đều đến khi bánh phồng vàng."], cookTime: 65, servings: 6, difficulty: "Vừa",
  }),
  defineDish({
    slug: "banh_tai_heo", nameVi: "Bánh tai heo", nameEn: "Swirled crisp cookies", tags: ["Ngọt"],
    summary: "Bánh quy chiên giòn có lát cắt xoáy như hình chiếc tai.",
    origin: "Bánh tai heo là món bánh ăn vặt quen thuộc ở nhiều nơi. Tên gọi đến từ hình dáng tròn của lát bánh.",
    flavor: "Bánh giòn rụm, có vị ngọt nhẹ và mùi mè. Phần cacao tạo vân màu nâu.",
    flavorProfile: { sweet: 2, salty: 0, rich: 2, crunchy: 5 },
    whereToEat: { region: "Quầy bánh khô, chợ và tiệm tạp hóa ở nhiều tỉnh thành.", bestTime: "Ăn vặt trong ngày hoặc dùng cùng trà.", tip: "Chọn gói kín và khô để bánh giữ được độ giòn." },
    funFacts: ["Lát bánh có hình xoáy do hai phần bột khác màu được cuộn lại.", "Bánh thường được cắt thật mỏng trước khi chiên.", "Tên gọi mô tả hình dáng chứ không phải nguyên liệu của bánh."],
    ingredients: [{ name: "Bột mì", amount: "250 g" }, { name: "Đường", amount: "60 g" }, { name: "Trứng gà", amount: "1 quả" }, { name: "Nước cốt dừa", amount: "80 ml" }, { name: "Bột cacao", amount: "10 g" }, { name: "Mè trắng", amount: "20 g" }, { name: "Muối", amount: "1/4 thìa cà phê" }, { name: "Dầu ăn", amount: "500 ml" }],
    steps: ["Trộn bột mì với đường, muối, trứng và nước cốt dừa.", "Nhồi bột đến khi mịn rồi chia thành hai phần.", "Trộn cacao vào một phần bột.", "Cán hai phần thành tấm mỏng và đặt chồng lên nhau.", "Cuộn chặt thành khối trụ, bọc kín rồi làm lạnh.", "Cắt lát thật mỏng và rắc mè nếu cần.", "Chiên từng mẻ ở lửa vừa đến khi bánh vàng giòn."], cookTime: 55, servings: 6, difficulty: "Vừa",
  }),
];