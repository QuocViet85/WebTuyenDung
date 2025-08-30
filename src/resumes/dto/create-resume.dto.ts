import { IsMongoId, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    userId: ObjectId;

    @IsNotEmpty()
    url: string

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    companyId: ObjectId;

    @IsNotEmpty()
    jobId: ObjectId;
}

export class CreateUserCvDTO {
    @IsNotEmpty({message: 'url không được để trống'})
    url: string;

    @IsNotEmpty({message: 'companyId không được để trống'})
    @IsMongoId({message: 'companyId is a mongo id'})
    companyId: ObjectId;

    @IsNotEmpty({message: 'JobId không được để trống'})
    @IsMongoId({message: 'jobId is a mongo id'})
    jobId: ObjectId;
}
