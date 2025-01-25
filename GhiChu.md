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

Chương 6: Restful API
Bài 22:
1. Thư viện hash password: npm i bcryptjs, npm i @types/bcryptjs
- plain text: text người có thể đọc hiểu.
- hash text: text người không thể đọc hiểu.

*  Muốn sử dụng Mongo trong module nào thì phải import mongo module vào module đó.
* Injectable(enntity.name) là decorator đánh dấu biến sẽ được tiêm (inject) giá trị là đối tượng kiểu model bọc entity.

2. dto = data transfer object
- DTO là đối tượng định nghĩa cách dữ liệu được gửi lên từ client.
- Dữ liệu gửi lên từ client và dữ liệu lưu vào database có thể có phần khác nhau, nên cần có DTO để nhận dữ liệu từ client rồi sau đó viết code để lưu dữ liệu phù hợp vào database.
- DTO còn giúp validate dữ liệu từ client gửi lên.
- @Body("key") biến: gán giá trị của trường có key được chỉ định vào biến.
- @Body() dto: gán giá trị của trường có key giống tên thuộc tính đối tượng dto vào thuộc tính đối tượng dto đó.

3. pipe:
- Tất cả class sử dụng decorator @Injectable là pipe.

* Chức năng của pipe:
- Transformation: Chuyển đổi dữ liệu sang định dạng mong muốn.
- Validation: kiểm tra dữ liệu gửi lên đã hợp lệ chưa.

4. Validation:
* Thư viện Class validator: npm i --save class-validator class-transformer
* Phân tích:
- Decorator validate của class-validator trong class dto để chỉ định cách validate.
- Validation Pipe là đối tượng tiến hành validate dựa vào cách validate được khai báo trong Decorator validate của class-validator. Vì vậy, trong file main.ts cần khai báo sử dụng Validation Pipe: app.useGlobalPipes(new ValidationPipe()).