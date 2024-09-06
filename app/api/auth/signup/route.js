import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import User from "../Model/User"
import { connectdatabase } from "@/app/Mongodb/database";

export const POST = async (request) => {
    const {name , email , password} = await request.json();

    try {
        await connectdatabase();
        if(!name || !email || !password) return NextResponse.json({error : "all field required"});

        const userExists = await User.findOne({email});

        if(userExists) return NextResponse.json({error : "Already have account"} , {status : 400});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
    
        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}