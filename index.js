const readlineSync = require('readline-sync')
const chalk = require('chalk')
const scoreService = require('./services/scoreService')

const log = console.log
log(chalk.keyword('orange')('Welcome to the ' + chalk.bold('Grand Theft Auto') + ' quiz game'))
const username = readlineSync.question('Enter your name: ')
log(chalk.keyword('grey')(`Hi! ${username}, let me explain you the rules
This quiz is gonna test your knowledge of GTA series
So there are 3 levels
You start at level 1
you have to answer all the questions of the current level to go to the next one
if you weren't able to level up, you can just refresh the page and play again
`))


const questionBank = [
  {
    que: 'In what year is Grand Theft Auto: Vice City set?',
    opt: ['1983', '1989', '1986', '1980'],
    ans: '1986'
  },
  {
    que: 'What is the name of Grand Theft Auto: San Andreas\'s most famous mod?',
    opt: ['hot coffee', 'cold coffee', 'hot tea', 'cold tea'],
    ans: 'hot coffee'
  },
  {
    que: 'What year was the very first Grand Theft Auto game released?',
    opt: ['2000', '1997', '1999', '1998'],
    ans: '1998'
  },
  {
    que: 'What is the name of the development company behind the GTA series?',
    opt: ['Bethesda', 'Rockstar Games', 'Square Enix', 'Naughty Dog'],
    ans: 'Rockstar Games'
  },
  {
    que: 'What was the name of the game that came after Grand Theft Auto III?',
    opt: ['Grand Theft Auto: San Andreas', 'Grand Theft Auto: Vice City', 'Grand Theft Auto: IV', 'Grand Theft Auto: The Ballad Of Gay Tony'],
    ans: 'Grand Theft Auto: Vice City'
  },
  {
    que: 'What is the name of the city that Grand Theft Auto IV is set in?',
    opt: ['Liberty City', 'Los Santos', 'Los Albertos', 'New York'],
    ans: 'Liberty City'
  },
  {
    que: 'Which of these was NOT a playable character in GTA V?',
    opt: ['Michael De Santa', 'Niko Bellic', 'Franklin Clinton', 'Trevor Philips'],
    ans: 'Niko Bellic'
  },
  {
    que: 'How much money did GTAV make in its first 24 hours of release?',
    opt: ['$400 million', '$800 million', '$200 million', '$100 million'],
    ans: '$800 million'
  },
  {
    que: 'What year was GTAV first released?',
    opt: ['2015', '2012', '2013', '2014'],
    ans: '2013'
  },
  {
    que: 'With 98%, which of these games has the highest score of the series according to Metacritic?',
    opt: ['Grand Theft Auto: San Andreas', 'Grand Theft Auto: Vice City', 'Grand Theft Auto: IV', 'Grand Theft Auto: V'],
    ans: 'Grand Theft Auto: IV'
  },
  {
    que: 'What street is the main base of CJ in Grand Theft Auto: San Andreas?',
    opt: ['Station Avenue', 'Pine Road', 'West Drive', 'Grove Street'],
    ans: 'Grove Street'
  },
  {
    que: 'Which of these heists was the brainchild of Trevor Philips?',
    opt: ['The Jewel Store Job', 'The Merryweather Heist',
      'The Bureau Raid', 'The Paleto Score'],
    ans: 'The Merryweather Heist'
  },
  {
    que: 'Which scenario will you not see Trevor in when you switch back to him?',
    opt: ['Being chased by police with a two-star wanted level', 'Driving a Faggio with his "scooter brother', 'Waking up hungover in a flowery woman\'s dress', 'Rage quitting a video game at home'],
    ans: 'Rage quitting a video game at home'
  },
  {
    que: 'Which Was The First Game In Which The Player-character Had The Ability To Swim?',
    opt: ['GTA III', 'GTA: Vice City', 'GTA: San Andreas', 'GTA IV'],
    ans: 'GTA: San Andreas'
  },
  {
    que: 'What\'s The Name Of The Central City In GTA V?',
    opt: ['Liberty City', 'Los Santos', 'Los Albertos', 'New York'],
    ans: 'Los Santos'
  }
]



let score = 0

readlineSync.keyInPause('press any key to begin the game')

function checkAnswer(index, value, ans) {
  if (questionBank[index].opt[value] === ans) {
    score += 2
    log(chalk.green('Correct!'))
    log(chalk.cyan(`Score: ${score}`))
  } else {
    log(chalk.red('Wrong!'))
  }
}

function askQue(start, end) {
  for (let i = start; i < end; i++) {
    log('')
    log(chalk.hex('8EB9E9').bold(questionBank[i].que))
    let userAnswer = readlineSync.keyInSelect(questionBank[i].opt, 'press any key from ')
    checkAnswer(i, userAnswer, questionBank[i].ans)
  }
}

askQue(0, 5)

function failure() {
  log('')
  log(`your score: ${score}`)
  log('')
  log(chalk.red('Oops! you didn\'t make it to the next level'))
  log(chalk.red('Thanks for playing the game'))
  log(chalk.red('restart the page for playing again'))
}

if (score === 10) {
  log(chalk.keyword('green')('you have leveled up!!'))
  log('')
  log(chalk.bold.keyword('green')(' LEVEL 2 '))
  log('')
  readlineSync.keyInPause('press any key to continue to next part')
  askQue(5, 10)
} else if (score < 10) {
  failure()
}

if (score === 20) {
  log(chalk.keyword('orange')('you have leveled up!! '))
  log('')
  log(chalk.bold.keyword('green')(' LEVEL 3 '))
  log('')
  readlineSync.keyInPause('press any key to continue to next part')
  askQue(10, 15)
} else if (score > 10 && score < 20) {
  failure()
}

if (score === 30) {
  log(chalk.keyword('orange')('you are awesome!!'))
  log(chalk.keyword('orange')('you must be a huge gta fan'))
  log(chalk.keyword('orange')('send me a screenshot with your score to get your name into the leaderboards'))
} else if (score > 20 && score < 30) {
  log(chalk.red('Tough luck!! you were so close'))
  log(chalk.red('Thanks for playing the game'))
}

async function saveScore() {
  const highScores = await scoreService.getAll()
  const previousScore = highScores.find(h => h.name === username)

  const newScore = {
    name: username,
    score: score
  }

  if (previousScore) {
    if (previousScore.score < score) {
      console.log('Score Updated!!')
      await scoreService.update(username, newScore)
    } else {
      return
    }
  } else {
    console.log('Score Saved!!')
    await scoreService.create(newScore)
  }
}

async function displayHighscores() {
  const highScores = await scoreService.getAll()
  log('')
  log(chalk.keyword('orange')('Current Highscores:'))

  highScores
  .sort((a, b) => b.score - a.score)
  .forEach(s => {
    log('')
    log(chalk.green.bold('name: ') + s.name)
    log(chalk.green.bold('score: ') + s.score)
  })
}


async function queueAsync() {
  await saveScore()
  log('')
  readlineSync.keyInPause(chalk.hex('09EDFC').bold('press any key to see the leaderboards'))
  await displayHighscores()
}
queueAsync()
