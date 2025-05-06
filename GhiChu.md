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

Chương 9: Tư duy phân tích database
Bài 44: Giới thiệu đề bài
Đăng tin tuyển dụng, việc làm => Kết hợp phân quyền
- Ứng viên có thể tìm việc làm theo skill.
- Nhà tuyển dụng có thể đăng việc làm.
- Đặt lịch (schedule) gửi mail cho subscribers.
Phân tích chi tiết chức năng:
- Đăng kí, đăng nhập (basic: local).
- Tạo skills để search.
- Nhà tuyển dụng: thông tin giới thiệu về công ty.
- Ứng viên: người có thể xem bài đăng tuyển dụng và gửi CV.
- Admin: duyệt CV rồi mới gửi tới nhà tuyển dụng.
- Nếu 1 ứng viên subscribe 1 skilss => gửi mail hàng toàn về những jobs này.

Bài 45: Phân tích model và relationship:
1. Đối tượng
Actors: (người sử dụng hệ thống)
- Ứng viên (employee).
- Nhà tuyển dụng: company.
- Admin.

Đối tượng khác:
- CV của ứng viên
- Jobs đăng tuyển.
- Skill để search
- Role: vai trò của user trong hệ thống (admin, hr,...).
- Permission: quyền hạn sử dụng hệ thống - ám chỉ api của backend.

2. Relationship:
- 1 ứng viên: n cv
- 1 nhà tuyển dụng: n jobs.
- n skills: n jobs.

về phân quyền:
1 permission (quyền hạn) ám chỉ 1 apis của backend.
1 role (vai trò) bao gồm nhiều quyền hạn.
1 người dùng sẽ có 1 role duy nhất, nếu muốn merge role => tạo role mới.

1 users -> có 1 role.
1 role có thể có nhiều users có cùng role này.

1 role -> có nhiều permissions (apis).
1 permission -> có thể thuộc nhiều role khác nhau.

Bài 46: Thiết kế model
1. Users (admin, ứng viên, nhân viên cty -> phân biệt nhờ role)
- name: string
- email: string <unique>
- password: string
- age: number
- gender: string
- address: string
- company: object (_id, name)
- role: string
- refreshToken: string

- createdAt: Data
- updatedAt: Date
- isDeleted: boolean
- createdBy: object(_id, email)
- updatedBy: object(_id, email)
- deleteBy: object(_id, email)

2. Companies
- name: string
- address: string
- description: string <html>

- createdAt: Data
- updatedAt: Date
- isDeleted: boolean
- createdBy: object(_id, email)
- updatedBy: object(_id, email)
- deleteBy: object(_id, email)

3. Resume (CV)
- email: string
- userId: objectId
- url: string
- status: string //PENDING-REVIEWING-APPROVED-REJECTED
- history: array object [{status: string, updatedAt:Date, updatedBy: {_id, email}}]

- createdAt: Data
- updatedAt: Date
- isDeleted: boolean
- createdBy: object(_id, email)
- updatedBy: object(_id, email)
- deleteBy: object(_id, email)

4. Jobs
- name: string
- skill: string[]
- company: string
- location: string
- salary: string
- quantity: string (số lượng ứng tuyển)
- level: string //INTERN/FRESHER/JUNIOR/SENIOR
- description: string <html>
- startDate: Date
- endDate: Date
- isActive: Boolean

- createdAt: Data
- updatedAt: Date
- isDeleted: boolean
- createdBy: object(_id, email)
- updatedBy: object(_id, email)
- deleteBy: object(_id, email)

5. Subscribers
- email: string
- skill: string

6. Roles
- name: string <unique>
- description: string
- isActive: boolean
- permission: array object

- createdAt: Data
- updatedAt: Date
- isDeleted: boolean
- createdBy: object(_id, email)
- updatedBy: object(_id, email)
- deleteBy: object(_id, email)

7. Permission
- name: string
- path: string
- method: string
- description: string

- createdAt: Data
- updatedAt: Date
- isDeleted: boolean
- createdBy: object(_id, email)
- updatedBy: object(_id, email)
- deleteBy: object(_id, email)

Chương 10: Mongoose Plugins
Bài 47: Timestamps plugin
- Khai báo @Schema({timestamps: true}) để có timestamps (createdAt, updatedAt).

Bài 48: Soft-delete plugin
Cài đặt: npm i soft-delete-plugin-mongoose
Plugin soft-delete sẽ thêm 2 trường là: deletedAt và isDeleted

Bài 49: Query Builder
Thư viện Query Builder để phân trang: npm i --save api-query-params

//
Bài 50: Setup dự án FrontEnd
Github dự án FrontEnd: https://github.com/haryphamdev/react-for-nest.
//
Đang chuyên tâm học BackEnd và chưa học Framework FrontEnd nên sẽ dùng Postman thay FrontEnd để thao tác với BackEnd.

Bài 52: Setup CORS Nestjs
Thêm đoạn code sau vào file main.js:
  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
    }
  );

Chương 11: Modules Company
Bài 53: Generate Modules Company
Bài 54: Bài tập Create Company
Bài 55: Update User Type (JWT)
Bài 56: Passing Req.user
- Inject Request vào Service sẽ làm hiệu năng kém đi vì Service sẽ bị chuyển scope từ Singleton thành Request dẫn đến tạo Service mới khi có Request mới thay vì chỉ sử dụng 1 Service từ đầu.
Bài 57: Bài tập Update Company
Bài 58: Bài tập Delete Company
Bài 59: Query with Pagination
* Thư viện phân trang : npm i api-query-params
Bài 60: Giới thiệu về Interceptors
* Interceptors là cách can thiệp vào req và res, tương tự guard - thông minh hơn middleware. Mục đích chính của Interceptor là thay đổi dữ liệu được trả về bởi function để chuẩn hóa dữ liệu gửi về client.
* Observable khác Promise ở chỗ là Observable khi được gọi rồi thì có thể hủy được.
Bài 61: Transform Response
Bài 62: Version APIs

Chương 12: Modules User
Bài 63: Update User Schema
1. Update model
Users (user.schema): (admin, ứng viên, nhân viên cty -> phân biệt nhờ role)

2. Update dto/validation
Validate object trong dto: https://stackoverflow.com/questions/53786383/validate-nested-objects-using-class-validator-and-nestjs

Bài 64: Bài tập CRUD Users
Các endpoint cần tạo (6 apis)
1. POST /api/v1/auth/register
- Không cần truyền lên JWT
- Body: name, email, password, age, gender, address
Ở BackEnd, hardcode role === USER & hash password trước khi lưu
Không cần cập nhật createdBy (vì không sử dụng jwt token)
Response: {
  'statusCode': 201,
  'message': 'Register a new user',
  'data': {
    _id: '...',
    createdAt: '...'
  }
}

2. POST /api/v1/users
- Cần truyền JWT
- Body: name, email, password, age, gender, address, role, company: object {_id, name}
Ở BackEnd, tự động cập nhật createdBy: object {_id, email}
Response: {
  'statusCode': 201,
  'message': 'Create a new User',
  'data': {
    '_id': '...',
    'createdAt': '...'
  }
}

3. PATCH /api/v1/users
- Cần truyền lên JWT
- Body: _id, name, email, age, gender, address, role, company, object {_id, name}
Ở BackEnd, tự động cập nhật updatedBy: object {_id, email}

4. DELETE /api/v1/users/:id
- Cần truyền lên JWT
Ở BackEnd, tự động cập nhật deletedBy: object {id, email} và sử dụng soft-delete

Response: {
  'statusCode': 200,
  'message': 'Delete a User',
  'data' { 
    'deleted': ...
  }
}

5. GET /api/v1/users/:id
Fetch user by ID
- Không cần truyền lên JWT

Response: (không trả về password) => trả về full record trừ password

6. GET /api/v1/users
Fetch users with paginate
- Cần truyền lên JWT

Response: (không trả về password) => trả về full record trừ password

Bài 65: Chức năng login
* Yêu cầu:
- Đăng nhập thành công, trả ra access_token và thông tin user.
- Lưu refresh_token vào cookies.

Bài 66: API Login
Refresh Token
Khi login, cần tạo ra Refresh token
- User login thành công, trước khi return accessToken, cần update thông tin user với refreshToken được tạo.
- RefreshToken có thể lưu dưới 2 định dạng: jwt hoặc là 1 chuỗi string ngẫu nhiên => sử dụng jwt
- Cần lưu cookies (refreshToken) cho người dùng.

Bài 67: Set Cookies
Cookie Nestjs: https://docs.nestjs.com/techniques/cookies
- Nếu set HttpOnly = true trong cookie thì cookie chỉ đọc được ở Server mà không thể dùng JS để đọc ở Client.

Bài 68: API Get Account (F5 Refresh)
Khi user F5, cần gọi API của BackEnd, vì client không có khả năng decode (giải mã) accessToken để biết được ai là người đăng nhập
Tạo endpoint: GET /api/v1/auth/account
- Chỉ cần truyền lên JWT ở header.