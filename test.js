let object1 = {
    name: "zaki",
    age: 23,
}

let object2 = {
    languages: ["arabic", "french", "english"],
    sport: "typing on keyboard"
}

let object3 = {
    ...object1,
    ...object2
}



questions = [
    {
        text_question : "this is the first question",
        answers : [
            {
                text: "answer 1",
                isCorrect: true
            },
            {
                text: "answer 2",
                isCorrect: false
            },
            {
                text: "answer 2",
                isCorrect: false
            }
        ]
    },
    {
        text_question : "this is the second question",
        answers : [
            {
                text: "answer 1",
                isCorrect: true
            },
            {
                text: "answer 2",
                isCorrect: false
            },
            {
                text: "answer 2",
                isCorrect: false
            }
        ]
    }

]