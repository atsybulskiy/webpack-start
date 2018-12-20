export class Amazon {
    getCurrentMarketplaceId(): string {
        let domain = window.location.origin.split('.').reverse()[0];
        let map = {};
        map['com'] = 'ATVPDKIKX0DER';
        map['ca'] = 'A2EUQ1WTGCTBG2';
        map['mx'] = 'A1AM78C64UM0Y8';
        map['de'] = 'A1PA6795UKMFR9';
        map['es'] = 'A1RKKUPIHCS9HS';
        map['fr'] = 'A13V1IB3VIYZZH';
        map['it'] = 'APJ6JRA9NG5V4';
        map['uk'] = 'A1F83G8C2ARO7P';
        map['jp'] = 'A1VC38T7YXB528';
        return map[domain];
    }
}
