export const App = {
    config: {
        debug: false,
        sendRequestToBackend:false,
        reloadTabsOnInstall: [
            '*://www.amazon.com/*',
            '*://www.amazon.co.uk/*',
            '*://www.amazon.ca/*',
            '*://www.amazon.fr/*',
            '*://www.amazon.de/*',
            '*://www.amazon.it/*',
            '*://www.amazon.es/*',
            '*://members.helium10.com/*'
        ],
        mainWindow: {
            title: 'Helium 10',
            historyTableSize: -1,
            pullHistoryRecordInsteadOfNewScrapingAfter: 1000 * 60 * 60 * 24//24 hours
        },
        profileScraper: {
            cacheDuration: 7 * 24 * 60 * 60 * 1000//7 days
        },
        backend: {
            baseUrl: 'https://members.helium10.com',
            token: 'f884da2fb80f785c49152c85f8db14775588f226',
            processQueueInterval: 3000
        },
        memberAccountUrl: 'https://members.helium10.com',
        homepageUrl: 'https://helium10.com',
        modules: {
            allTools: {
                url: '/'
            }
        }
    }
};
