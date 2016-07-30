module.exports = {
    successData: {
        senderId: 'good sender',
        text: 'good wording',
        req: {
            body: {
                object: 'page',
                entry: [
                    {
                        messaging: [
                            {
                                sender: {
                                    id: 'good sender',
                                },
                                message: {
                                    text: 'good wording',
                                },
                            },
                        ],
                    },
                ],
            },
        },
    },
    failureData: {
        errorMessage: 'I don\'t like you',
    },
};
