import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    _id: mongoose.Schema.Types.ObjectId;

    name: string;
} 

export class CreateJobDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    // @IsNotEmpty({message: 'Skills không được để trống'})
    // @Transform(({value}) => {typeof value === 'string' ? value.split(',').map(v => v.trim()) : value})
    @IsArray({message: 'Skills phải là mảng'})
    @IsString({each: true, message: 'Skill phải có định dạng string'})
    skills: string[];

    @IsNotEmpty({message: 'Location không được để trống'})
    location: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    salary: number;

    quantity: number;

    level: string;
    
    @IsNotEmpty({message: 'Description không được để trống'})
    description: string;
    
    @Transform(({value}) => {
        if (value) {
            return new Date(value)
        }
    })
    @IsDate({message: 'startDate có định dạng là Date'})
    startDate: Date = new Date();
    
    @Transform(({value}) => {
        if (value) {
            return new Date(value)
        }
    })

    @Transform(({value}) => {
        if (value) {
            return new Date(value)
        }
    })
    @IsDate({message: 'endDate có định dạng là Date'})
    endDate: Date = new Date();
    
    isActive: boolean = true;
}
