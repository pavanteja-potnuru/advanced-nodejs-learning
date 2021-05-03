import { get } from 'lodash';
import { Readable, Transform } from 'node:stream';
let startTime = new Date();
class User {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}
class ReadObjectsAsStream<T> extends Readable {
    private array;
    private index;
    constructor(array: Array<T>) {
        super({
            objectMode: true
        });

        this.array = array;
        this.index = 0;
    }

    _read() {
        if(this.index === this.array.length) this.push(null);
        else {
            const chunk = this.array[this.index];
            super.push(chunk);
            this.index++;
        }
    }
}

const arrayStream = new ReadObjectsAsStream<User>([
    new User('User 1'),
    new User('User 2')
]);

arrayStream.pipe(new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(data: User, encoding, callback) {
        if(data.name === 'User 1') callback(null, data);
        else callback();
    }
})).on('data', (user: User) => {
    console.log(user.name);
});
