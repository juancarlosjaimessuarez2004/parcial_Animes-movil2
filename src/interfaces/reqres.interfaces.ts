export interface ReqResUserListResponse {
    status:   number;
    type:     string;
    messages: Messages;
    error:    string;
}

export interface Messages {
    q: string[];
}
