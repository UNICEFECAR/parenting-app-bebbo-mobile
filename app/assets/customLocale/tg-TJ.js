IntlPolyfill.__addLocaleData({
    "locale":"tg-TJ",
    "date":{
       "ca":[
        "gregory",
        "generic"
       ],
       "hourNo0":true,
       "hour12":false,
       "formats":{
          "short":"{1}, {0}",
          "medium":"{1}, {0}",
          "full":"{1}, {0}",
          "long":"{1}, {0}",
          "availableFormats":{
             "d":"d",
             "E":"ccc",
             "Ed":"E, d",
             "Ehm":"E, h:mm a",
             "EHm":"E, HH:mm",
             "Ehms":"E, h:mm:ss a",
             "EHms":"E, HH:mm:ss",
             "Gy":"y G",
             "GyMMM":"MMM y G",
             "GyMMMd":"d MMM y G",
             "GyMMMEd":"E, d MMM y G",
             "h":"h a",
             "H":"HH",
             "hm":"h:mm a",
             "Hm":"HH:mm",
             "hms":"h:mm:ss a",
             "Hms":"HH:mm:ss",
             "hmsv":"h:mm:ss a, v",
             "Hmsv":"HH:mm:ss, v",
             "hmv":"h:mm a, v",
             "Hmv":"HH:mm, v",
             "M":"L",
             "Md":"d.M",
             "MEd":"E, d.M",
             "MMdd":"d.M",
             "MMM":"LLL",
             "MMMd":"d MMM",
             "MMMEd":"E, d MMM",
             "MMMMd":"d MMMM",
             "MMMMEd":"E, d MMMM",
             "ms":"mm:ss",
             "y":"y",
             "yM":"M.y",
             "yMd":"d.M.y",
             "yMEd":"E, d.M.y",
             "yMMM":"MMM y",
             "yMMMd":"d MMM y",
             "yMMMEd":"E, d MMM y",
             "yMMMM":"MMMM y",
             "yQQQ":"QQQ, y",
             "yQQQQ":"QQQQ, y"
          },
          "dateFormats":{
             "yMMMMEEEEd":"EEEE, d MMMM y",
             "yMMMMd":"d MMMM y",
             "yMMMd":"d MMM y",
             "yMd":"d.M.yy"
          },
          "timeFormats":{
             "hmmsszzzz":"h:mm:ss a, zzzz",
             "hmsz":"h:mm:ss a, z",
             "hms":"h:mm:ss a",
             "hm":"h:mm a"
          }
       },
       "calendars":{
        "generic":{
            "months":{
               "narrow":[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12"
               ],
               "short":[
                  "M01",
                  "M02",
                  "M03",
                  "M04",
                  "M05",
                  "M06",
                  "M07",
                  "M08",
                  "M09",
                  "M10",
                  "M11",
                  "M12"
               ],
               "long":[
                  "M01",
                  "M02",
                  "M03",
                  "M04",
                  "M05",
                  "M06",
                  "M07",
                  "M08",
                  "M09",
                  "M10",
                  "M11",
                  "M12"
               ]
            },
            "days":{
               "narrow":[
                  "н",
                  "п",
                  "в",
                  "с",
                  "ч",
                  "п",
                  "с"
               ],
               "short":[
                  "нд",
                  "пн",
                  "вт",
                  "ср",
                  "чт",
                  "пт",
                  "сб"
               ],
               "long":[
                  "неделя",
                  "понеделник",
                  "вторник",
                  "сряда",
                  "четвъртък",
                  "петък",
                  "събота"
               ]
            },
            "eras":{
               "narrow":[
                  "ERA0",
                  "ERA1"
               ],
               "short":[
                  "ERA0",
                  "ERA1"
               ],
               "long":[
                  "ERA0",
                  "ERA1"
               ]
            },
            "dayPeriods":{
               "am":"пр.об.",
               "pm":"сл.об."
            }
         },
          "gregory":{
             "months":{
                "narrow":[
                    "Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"
                ],
                "short":[
                    "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"
                ],
                "long":[
                    "Январ", "Феврал", "Март", "Апрел", "Май", "Июн", "Июл", "Август", "Сентябр", "Октябр", "Ноябр", "Декабр"
                ]
             },
             "days":{
                "narrow":[
                    "Я", "Д", "С", "Ч", "П", "Ҷ", "Ш"
                ],
                "short":[
                    "Яшб", "Дшб", "Сшб", "Чшб", "Пшб", "Ҷмъ", "Шнб"
                ],
                "long":[
                    "Якшанбе", "Душанбе", "Сешанбе", "Чоршанбе", "Панҷшанбе", "Ҷумъа", "Шанбе"
                ]
             },
            //need to check for 4 eras in other files
             "eras":{
                "narrow":[
                    "П",
                    "П"
                ],
                "short":[
                    "ПеМ", 
                    "ПаМ"
                ],
                "long":[
                    "Пеш аз милод",
                    "ПаМ"
                ]
             },
             "dayPeriods":{
                "am":"пе. чо.",
                "pm":"па. чо."
             }
          }
       }
    },
    "number":{
       "nu":[
          "latn"
       ],
       "patterns":{
          "decimal":{
             "positivePattern":"{number}",
             "negativePattern":"{minusSign}{number}"
          },
          "currency":{
             "positivePattern":"{number} {currency}",
             "negativePattern":"{minusSign}{number} {currency}"
          },
          "percent":{
             "positivePattern":"{number}{percentSign}",
             "negativePattern":"{minusSign}{number}{percentSign}"
          }
       },
       //need to check for below
       "symbols":{
          "latn":{
             "decimal":",",
             "group":" ",
             "nan":"NaN",
             "plusSign":"+",
             "minusSign":"-",
             "percentSign":"%",
             "infinity":"∞"
          }
       },
       "currencies":{
          "BGN":"лв.",
          "EUR":"€",
          "USD":"щ.д.",
          "XAF":"FCFA",
          "XOF":"CFA",
          "XPF":"CFPF"
       }
    }
 });