const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'YuZhi',
            room: 'node js'
        },{
            id: '2',
            name: 'Xue',
            room: 'node js'
        },{
            id: '3',
            name: 'Feathery',
            room: 'Flutter'
        }];
    });

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: '14',
            name: 'YuZhi',
            room: 'socketIO'
        };

        let reUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });
    
    it('should return names for node js', () => {
        let userList = users.getUserList('node js');

        expect(userList).toEqual(['YuZhi', 'Xue']);
    });

    it('should return names for Flutter', () => {
        let userList = users.getUserList('Flutter');

        expect(userList).toEqual(['Feathery']);
    });

    it('should find user', () => {
        let userID = '2',
            user = users.getUser(userID);

        expect(user.id).toEqual(userID);
    });

    it('should not find user', () => {
        let userID = '87',
            user = users.getUser(userID);
        
        expect(user).toBeUndefined;
    });

    it('should remove a user', () => {
        let userID = '1',
            user = users.removeUser(userID);

        expect(user.id).toBe(userID);
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        let userID = '108',
            user = users.removeUser(userID);

        expect(user).toBeUndefined;
        expect(users.users.length).toBe(3);
    });

});