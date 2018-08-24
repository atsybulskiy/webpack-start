interface Person {
    name: string;
    age: number;
}

export class User implements Person {
    age: number;
    name: string;

    constructor() {
        this.age = 32;
        this.name = 'Саня';
    }

    sumTo(n) {
        const array = [0, 1, 2];
        console.log('n', [...array, n]);
    }

    log = () => {
        this.sumTo(this.age);
    }

}

const user = new User;

console.log(user.age);
console.log('hello');
