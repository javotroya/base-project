var App = {
    Const      : {
        limitTypeahead  : 9999,
        likeSearchOffset: 50,
        wcFileModule    : 1,
        subroFileModule : 2,
        Designations    : {
            lienBill     : 53,
            lienOMFS     : 55,
            lienObjection: 54
        },
        clientTypes    : {
            INSURER   : 2,
            TPA       : 3,
            COMPANY   : 4,
            INDIVIDUAL: 5,
        },
        eventTypes     : {
            wcClosed                : 19,
            wcLienClosed            : 199,
            wcOpen                  : 202,
            wcReOpen                : 203,
            wcLienOpen              : 204,
            wcLienReOpen            : 205,
            subroOpen               : 268,
            subroReOpen             : 269,
            subroClosed             : 270,
            subroLienOpen           : 271,
            subroLienReOpen         : 272,
            subroLienClosed         : 273,
            subroInterventionOpen    : 274,
            subroInterventionReOpen  : 275,
            subroInterventionReClosed: 276,
        },
        filesURLs      : {
            1 : '#files',
            2 : '#subro_files'
        },
        modules: {
            1 : 'Workers Compensation',
            2 : 'Subrogation'
        }
    },
    Base       : {},
    Templates  : {},
    Controllers: {},
    Helpers    : {},
    Views      : {},
    Models     : {},
    Collections: {},
    Router     : {},
    siteKey    : '6LekwwYTAAAAAPCBtHIJwNg4S0xQE5T2DAh0y0OE'
};