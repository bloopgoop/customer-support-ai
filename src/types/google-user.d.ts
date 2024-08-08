// Google firebase UserImpl
export interface GoogleUser {
    uid: string;
    displayName?: string;
    photoURL?: string;
    email?: string;
    
    metadata?: UserMetadata;
}

export interface UserMetadata {
    [key: string]: any;
}