const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message')

describe('Generate Message', () => {
    it('should generate correct message object', () => {
        let from = "YuZhi",
            text = 'hi there',
            message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({ from, text });
    })
});

describe('Generate Location Message', () => {
    it('should generate correct location object', () => {
        let from = 'Claire',
            lat = 14,
            lng = 56,
            url = `https://www.google.com/maps?q=${lat},${lng}`,
            message = generateLocationMessage(from, lat, lng);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({ from, url });
    });
});