export const projectInfo = {
  goal: [
    "Soi Bánh nhận diện 10 loại bánh Việt Nam từ ảnh đầu vào.",
    "Hệ thống tiếp tục tìm vị trí nguyên liệu trên ảnh đó.",
  ],
  pipeline: [
    { title: "Ảnh đầu vào", explanation: "Ảnh được chuyển vào quy trình nhận diện." },
    { title: "Bước 1: YOLOv8s-cls nhận diện món", explanation: "Bộ phân loại chọn một trong 10 loại bánh đã học." },
    { title: "Bước 2: Grounding DINO tìm nguyên liệu theo từng món", explanation: "Bộ phát hiện tìm nguyên liệu bằng mô tả văn bản, không cần nhãn riêng cho từng nguyên liệu." },
    { title: "Kết quả trên ảnh", explanation: "Tên món và vị trí nguyên liệu được trình bày trên ảnh." },
  ],
  stats: [
    { value: "10", label: "loại bánh", explanation: "Các lớp bánh Việt có trong bộ dữ liệu." },
    { value: "YOLOv8s-cls", label: "mô hình phân loại", explanation: "Phân loại món bánh trong ảnh." },
    { value: "99,8%", label: "độ chính xác top-1", explanation: "Kết quả trên tập kiểm định của dự án." },
    // update after retraining
    { value: "2.798", label: "ảnh huấn luyện", explanation: "Số ảnh dùng để huấn luyện mô hình." },
    { value: "1.354", label: "ảnh kiểm định", explanation: "Số ảnh dùng để đánh giá mô hình." },
  ],
  limitations: [
    "Mô hình chỉ có 10 lớp bánh; món khác có thể bị nhận nhầm.",
    "Độ tin cậy nguyên liệu thường ở mức 25–40% vì bộ phát hiện không học từ nhãn nguyên liệu riêng.",
    "Website dùng kết quả mẫu dựng sẵn; ảnh tải lên chưa được phân tích trực tiếp.",
    "Ảnh tối, mờ hoặc chụp từ xa có thể làm giảm độ chính xác.",
  ],
  technologies: {
    models: ["Python", "Ultralytics YOLOv8", "Hugging Face Transformers", "Grounding DINO"],
    website: ["React", "Tailwind", "Node.js", "MongoDB"],
  },
  team: [
    { name: "Họ và tên", studentId: "MSSV", role: "Vai trò" },
    { name: "Họ và tên", studentId: "MSSV", role: "Vai trò" },
    { name: "Họ và tên", studentId: "MSSV", role: "Vai trò" },
  ],
  lecturer: "Tên giảng viên",
  course: "Tên học phần",
} as const;