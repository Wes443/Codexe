import { Timestamp } from "firebase/firestore";

export class User {
    uid: string;
    firstName: string;
    lastName: string;
    joinDate: Timestamp;
    email: string;

    constructor (
        uid: string,
        firstName: string,
        lastName: string,
        joinDate: Timestamp,
        email: string,
    ) {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.joinDate = joinDate;
        this.email = email;
    }
}

export interface Session {
    userUid: string;
    accuracy: Float16Array;
    stdWpm: Int16Array;
    rawWpm: Int16Array;
    language: string;
    textLen: Int16Array;
    correct: Int16Array;
    incorrect: Int16Array;
    time: Int16Array;
    dateAchieve: Timestamp;
}