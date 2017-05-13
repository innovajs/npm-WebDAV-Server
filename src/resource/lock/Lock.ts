import { LockKind } from './LockKind'

export class Lock
{
    static generateUUID(expirationDate : number) : string
    {
        const rnd1 = Math.ceil(Math.random() * 0x3FFF) + 0x8000;
        const rnd2 = Math.ceil(Math.random() * 0xFFFFFFFF);

        function pad(value : number, nb : number)
        {
            let str = Math.ceil(value).toString(16);
            while(str.length < nb)
                str = '0' + str;
            return str;
        }

        let uuid = 'urn:uuid:';
        // time_low
        uuid += pad(expirationDate & 0xFFFFFFFF, 8);
        // time_mid
        uuid += '-' + pad((expirationDate >> 32) & 0xFFFF, 4);
        // time_hi_and_version
        uuid += '-' + pad(((expirationDate >> (32 + 16)) & 0x0FFF) + 0x1000, 4);
        // clock_seq_hi_and_reserved
        uuid += '-' + pad((rnd1 >> 16) & 0xFF, 2);
        // clock_seq_low
        uuid += pad(rnd1 & 0xFF, 2);
        // node
        uuid += '-' + pad(rnd2, 12);

        return uuid;
    }

    lockKind : LockKind
    expirationDate : number
    owner : string
    uuid : string

    constructor(lockKind : LockKind, owner : string)
    {
        this.expirationDate = Date.now() + lockKind.timeout;
        this.lockKind = lockKind;
        this.owner = owner;
        this.uuid = Lock.generateUUID(this.expirationDate);
    }

    expired() : boolean
    {
        return Date.now() > this.expirationDate;
    }
}