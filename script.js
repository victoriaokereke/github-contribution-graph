const input = document.querySelector("#username")
const generateGraphButton = document.querySelector("#generate-graph")
const contributionGrid = document.querySelector("#contribution-grid")
const monthLabels = document.querySelector("#month-labels")
const weekDayLabels = document.querySelector("#weekday-labels")
const moonSvg = document.querySelector(".lucide-moon")
const sunSvg = document.querySelector(".lucide-sun")
const darkModeButton = document.querySelector("#light-dark")
const body = document.querySelector("body")
const cellToolTip = document.querySelector("#contribution-tooltip")


function toggleLightDarkMode() {
    moonSvg.classList.toggle("hidden")
    sunSvg.classList.toggle("hidden")
    body.classList.toggle("dark-mode")
}
darkModeButton.addEventListener("click", toggleLightDarkMode)



generateGraphButton.addEventListener("click", generateGraph)

const monthInWords = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

async function generateGraph() {

    weekDayLabels.classList.add("hidden")

    contributionGrid.innerHTML = ""

    const username = input.value

    let url = `http://127.0.0.1:5000/contributions/${username}`

    const response = await fetch(url)

    const data = await response.json()

    const dates = []

    data.forEach(jsObj => {
        const contributionCell = document.createElement("div")
        contributionCell.classList.add("contribution-cell")
        contributionCell.dataset.date = jsObj.date
        contributionCell.dataset.level = jsObj.level
        contributionCell.dataset.count = jsObj.contribution_count
    
        contributionGrid.appendChild(contributionCell)
        dates.push(new Date(jsObj.date))



        contributionCell.addEventListener("mouseenter", (event) => {
            cellToolTip.textContent = `${contributionCell.dataset.count} contributions on ${(new Date(contributionCell.dataset.date)).toLocaleDateString( "en", {day: "numeric", month: "long", year: "numeric"})}`
            cellToolTip.classList.remove("hidden")


            cellToolTip.style.top = `${event.clientY - 60}px`
            cellToolTip.style.left = `${event.clientX - 120}px`

        })

        contributionCell.addEventListener("mouseleave", () => {
            cellToolTip.classList.add("hidden")
        })


    })  

    weekDayLabels.classList.remove("hidden")

    const earliestDate = new Date(Math.min(...dates))
    const earliestMonday = (earliestDate.setDate(earliestDate.getDate() - ((earliestDate.getDay() + 6) % 7)))


    monthLabels.innerHTML = ""

    dates.forEach(date=> {

        if (date.getDate() === 1) {

            const columnNumber = Math.floor((date - earliestMonday)/604800000)

            const month = monthInWords[date.getMonth()]

            const monthLabel = document.createElement("div")
            monthLabel.textContent = month
            monthLabel.style.gridColumn = columnNumber + 1

            monthLabels.appendChild(monthLabel)

        }
    }

    )  

}


