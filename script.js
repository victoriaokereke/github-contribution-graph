const input = document.querySelector("#username")
const generateGraphButton = document.querySelector("#generate-graph")
const contributionGrid = document.querySelector("#contribution-grid")
const monthLabels = document.querySelector("#month-labels")


generateGraphButton.addEventListener("click", generateGraph)

async function generateGraph() {

    contributionGrid.innerHTML = ""

    const username = input.value

    let url = `http://127.0.0.1:5000/contributions/${username}`

    const response = await fetch(url)

    const data = await response.json()

    data.forEach(jsObj => {
        const contributionCell = document.createElement("div")
        contributionCell.classList.add("empty-cell")
        contributionCell.dataset.date = jsObj.date
        contributionCell.dataset.level = jsObj.level
        contributionCell.dataset.count = jsObj.contribution_count

        contributionGrid.appendChild(contributionCell)

        // const dates = []

        // dates.map(
        //     new Date(jsObj.date)
        // )

        // const earliestDate = Math.min(dates)


    })  
    
    
}

