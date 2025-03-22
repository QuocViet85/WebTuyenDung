//user chứa thông tin người dùng đang đăng nhập được lấy từ accessToken
export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}