Bài 13: View Engine
- Cài đặt view engine: npm install ejs
- Để action trong controller trả về view engine thì cần dùng decorator @Render

Chương 5: Database
Bài 17: Cài đặt MongoDB
- Lệnh cài đặt thư viện mongoose: npm i mongoose

Bài 19: Sử dụng biến môi trường .env
* Cài đặt thêm thư viện: npm i --save @nestjs/config
* Lấy giá trị biến môi trường bằng 2 cách:
- Cách 1: inject ConfigService vào constructor và lấy giá trị biến môi trường từ đối tượng này.
- Cách 2: sử dụng biến process.env.tên biến môi trường. 
* Chú ý: import module ConfigModule ở trạng thái Global thì có thể inject ConfigService vào constructor của thành phần thuộc bất kỳ module nào mà không cần import module ConfigModule tại module đó. Tuy nhiên, để sử dụng biến process.env ở module nào thì module đó luôn phải import ConfigModule.

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

Chương 8: JWT - Json Web Token
Bài 36
Cài đặt thư viện passport js để thực hiện authen:
$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-localq3f5
* Phân tích công dụng của các thư viện:
- passport: tạo ra middleware (can thiệp vào request và response), và lưu thông tin người dùng đăng nhập vào request.user.
- nestjs/passport: thư viện hỗ trợ thư viện passport viết theo phong cách của Nestjs, giúp việc can thiệp vào passport dễ dàng hơn.
- passport-local: strategy của thư viện passport hỗ trợ việc đăng nhập sử dụng username/password

Bài 37: Guard
* Middleware: request -> middleware -> controller -> response.
- Middleware không thể biết được xử lý phía sau middleware là gì.
- Middleware gọi hàm next() thì request được đi tiếp, không gọi hàm next() thì trả về response.
* Guard: request -> guard -> controller -> response.
- Guard ngoài khả năng truy cập request và response như middleware thì còn có khả năng sử dụng "ExecutionContext" là không gian thực thi code. Vì vậy, guard biết được xử lý phía sau guard là gì.
- Guard trả về true thì request được đi tiếp, trả về false thì trả về response.

Bài 38: AuthGuard và LocalStrategy
Cơ chế chạy của AuthGuard('local'):
Bước 1: Lấy username và password từ request.
Bước 2: Tìm đối tượng LocalStrategy (là đối tượng của class kế thừa class PassportStrategy(Strategy) với Strategy thuộc thư viện local-strategy trong provider của các module), truyền username và password vào hàm validate(username, password) và gọi hàm validate(username, password) của đối tượng LocalStrategy.
Bước 3: Lấy giá trị trả về của hàm validate(username, password) trên gán vào request.user.
=> Cơ chế AuthGuard với các Strategy khác cũng tương tự, chỉ cần thay đổi tham số về tên Strategy trong tham số AuthGuard.

Bài 39: Sử dụng JWT
Thư viện JWT
$ npm install --save @nestjs/jwt passport-jwt
$ npm install --save-dev @types/passport-jwt

Bài 40: Implement Passport JWT

Bài 41: Enable authentication globally

Bài 42: Disable Global Guard
* MetaData là thông tin về dữ liệu. MetaData do Decorator trả về là thông tin về Class hoặc Method sử dụng Decorator đó (hay có thể nói là MetaData do Decorator trả về là MetaData của Class hoặc Method sử dụng Decorator đó), thông tin này thường được sử dụng để xử lý những tác vụ liên quan đến Class hoặc Method đó.
* Để lấy được MetaData của Class hoặc Method thì cần sử dụng đối tượng Reflector.

Bài 43: Fix bugs và tổng kết
* Thư viện convert từ string sang milliseconds
npm i --save-exact ms@2.1.3
npm i --save-dev @types/ms