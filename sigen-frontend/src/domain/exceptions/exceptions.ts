class Exception {
    constructor(public message: string) { }
}

class UnauthorizedException extends Exception {
    constructor(message: string = 'Unauthorized') {
        super(message);
    }
}

class NotFoundException extends Exception {
    constructor(message: string = 'Not Found') {
        super(message);
    }
}

class NoPermissionException extends Exception {
    constructor(message: string = 'No Permission') {
        super(message);
    }
}

class UserOrPasswordIncorrectException extends Exception {
    constructor(message: string = 'User or Password is incorrect') {
        super(message);
    }
}