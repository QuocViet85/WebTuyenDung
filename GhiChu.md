Bài 13: View Engine
- Cài đặt view engine: npm install ejs
- Để action trong controller trả về view engine thì cần dùng decorator @Render

Chương 5: Database
Bài 17: Cài đặt MongoDB
- Lệnh cài đặt thư viện mongoose: npm i mongoose

Bài 19: Sử dụng biến môi trường .env
* Cài đặt thêm thư viện: npm i --save @nestjs/config
* Lấy giá trị biến môi trường bằng 2 cách:
- Cách 1: inject configService và lấy giá trị biến môi trường từ đối tượng này.
- Cách 2: sử dụng biến process.env.tên biến môi trường.