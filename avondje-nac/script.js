// Global variables
let allStints = [];
let filteredStints = [];
let charts = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadAndProcessData();
        setupEventListeners();
        // Apply filters on initial load (this will filter out coaches with < 10 games by default)
        applyFilters();
    } catch (error) {
        console.error('Error initializing application:', error);
        document.getElementById('stintsContainer').innerHTML =
            '<p class="error">Fout bij laden van data. Bekijk de console voor details.</p>';
    }
});

// Load and parse CSV data
async function loadAndProcessData() {
    // Load game data
    const response = await fetch('data/avondje.csv');
    const csvText = await response.text();
    const games = parseCSV(csvText);

    // Load stats data
    const statsResponse = await fetch('data/stats.csv');
    const statsText = await statsResponse.text();
    const stats = parseCSV(statsText);

    // Group games by stint and merge with stats
    allStints = groupByStint(games, stats);
    filteredStints = [...allStints];
}

// Parse CSV text into array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const games = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const game = {};
            headers.forEach((header, index) => {
                game[header.trim()] = values[index].trim();
            });
            games.push(game);
        }
    }

    return games;
}

// Parse a single CSV line (handles commas within quotes)
function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    values.push(currentValue);
    return values;
}

// Group games by coach stint
function groupByStint(games, stats) {
    const stintMap = new Map();

    games.forEach(game => {
        const stintKey = `${game.stint_id}_${game.coach}`;

        if (!stintMap.has(stintKey)) {
            // Convert game start_date from DD/MM/YYYY to YYYY-MM-DD for matching
            const gameStartParts = game.start_date.split('/');
            const gameStartFormatted = `${gameStartParts[2]}-${gameStartParts[1]}-${gameStartParts[0]}`;

            // Find matching stats by period, coach, and start_date
            const periodStats = stats.find(stat =>
                stat.period === game.period &&
                stat.coach === game.coach &&
                stat.start_date === gameStartFormatted
            );

            stintMap.set(stintKey, {
                stintId: game.stint_id,
                coach: game.coach,
                startDate: game.start_date,
                endDate: game.end_date,
                games: [],
                // Add stats data
                avgGDvsXGD: periodStats ? parseFloat(periodStats.coach_avg_GD_vs_xGD) : null,
                avgPValue: periodStats ? (
                    (parseFloat(periodStats.period_p_value) +
                     parseFloat(periodStats.stadium_p_value) +
                     parseFloat(periodStats.day_type_p_value)) / 3
                ) : null
            });
        }

        const homeGoals = parseInt(game.HomeGoals);
        const awayGoals = parseInt(game.AwayGoals);
        const homeExGoals = parseFloat(game.HomeExGoals);
        const awayExGoals = parseFloat(game.AwayExGoals);

        // Calculate: ((HomeGoals - HomeExGoals) - (AwayGoals - AwayExGoals))
        const performanceDiff = (homeGoals - homeExGoals) - (awayGoals - awayExGoals);

        // Determine stadium from period
        if (!stintMap.get(stintKey).stadium) {
            stintMap.get(stintKey).stadium = game.period.includes('_rat') ? 'Rat Verlegh' : 'Beatrixstraat';
        }

        stintMap.get(stintKey).games.push({
            date: game.Date,
            away: game.Away,
            homeGoals: homeGoals,
            awayGoals: awayGoals,
            homeExGoals: homeExGoals,
            awayExGoals: awayExGoals,
            performanceDiff: performanceDiff
        });
    });

    // Convert map to array and sort games within each stint by date
    const stints = Array.from(stintMap.values()).map(stint => {
        stint.games.sort((a, b) => parseDate(a.date) - parseDate(b.date));
        stint.avgPerformance = stint.games.reduce((sum, g) => sum + g.performanceDiff, 0) / stint.games.length;
        return stint;
    });

    // Sort stints by start date (chronological)
    stints.sort((a, b) => parseDate(a.startDate) - parseDate(b.startDate));

    return stints;
}

// Parse date string (DD/MM/YYYY) to Date object
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}

// Format date for display
function formatDate(dateStr) {
    const date = parseDate(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Render all stints
function renderStints(stints) {
    const container = document.getElementById('stintsContainer');
    container.innerHTML = '';

    // Destroy existing charts
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    if (stints.length === 0) {
        container.innerHTML = '<p class="no-results">Geen resultaten gevonden. Probeer een andere zoekopdracht.</p>';
        return;
    }

    stints.forEach((stint, index) => {
        const stintRow = createStintRow(stint, index);
        container.appendChild(stintRow);

        // Create chart after DOM element is added
        setTimeout(() => {
            const canvasId = `chart-${index}`;
            createBarChart(canvasId, stint);
        }, 0);
    });
}

// Create a stint row element
function createStintRow(stint, index) {
    const row = document.createElement('div');
    row.className = 'stint-row';

    const coachCard = createCoachCard(stint);
    const chartContainer = createChartContainer(index);

    row.appendChild(coachCard);
    row.appendChild(chartContainer);

    return row;
}

// Create coach card HTML
function createCoachCard(stint) {
    const card = document.createElement('div');
    card.className = 'coach-card';

    // Format stats with proper rounding and + sign for positive values
    let avgGD = 'N/A';
    let avgGDColor = 'inherit';
    if (stint.avgGDvsXGD !== null) {
        const value = stint.avgGDvsXGD.toFixed(2);
        avgGD = stint.avgGDvsXGD > 0 ? `+${value}` : value;
        avgGDColor = stint.avgGDvsXGD > 0 ? '#E6B611' : '#921020'; // Yellow if positive, red if negative
    }

    const avgP = stint.avgPValue !== null ? stint.avgPValue.toFixed(3) : 'N/A';
    const avgPColor = (stint.avgPValue !== null && stint.avgPValue < 0.05) ? '#E6B611' : 'inherit'; // Yellow if p < 0.05

    // Create coach image filename from coach name (preserve spaces, use .png extension)
    const coachImagePath = `img/coach/${stint.coach}.png`;

    card.innerHTML = `
        <div class="coach-avatar">
            <img src="${coachImagePath}" alt="${stint.coach}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none;">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <div class="coach-info">
            <h2 class="coach-name">${stint.coach}</h2>
            <p class="stadium-name">${stint.stadium}</p>
            <p class="stint-period">${formatDate(stint.startDate)} - ${formatDate(stint.endDate)}</p>
            <p class="stint-stats">${stint.games.length} wedstrijden</p>
            <p class="stint-stats">Gem.: <span style="color: ${avgGDColor};">${avgGD}</span> (p=<span style="color: ${avgPColor};">${avgP}</span>)</p>
        </div>
    `;

    return card;
}

// Create chart container
function createChartContainer(index) {
    const container = document.createElement('div');
    container.className = 'chart-container';

    const canvas = document.createElement('canvas');
    canvas.id = `chart-${index}`;

    container.appendChild(canvas);

    return container;
}

// Create bar chart using Chart.js
function createBarChart(canvasId, stint) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const games = stint.games;

    // Prepare data
    const labels = games.map(() => ''); // Empty labels for minimal look
    const data = games.map(g => g.performanceDiff);

    // Color bars based on value (using theme colors)
    const backgroundColors = data.map(value => {
        if (value > 0.1) return '#E6B611'; // Yellow for positive performance
        if (value < -0.1) return '#921020'; // Red for negative performance
        return '#9A9083'; // Grey for neutral
    });

    // Custom plugin for drawing date labels at y=0 and season separators
    const dateLabelPlugin = {
        id: 'dateLabelPlugin',
        afterDatasetsDraw: (chart) => {
            const ctx = chart.ctx;
            const yScale = chart.scales.y;
            const xScale = chart.scales.x;
            const chartArea = chart.chartArea;

            ctx.save();

            // Helper function to get season string for a date
            const getSeasonString = (date) => {
                const year = date.getFullYear();
                const month = date.getMonth();
                if (month >= 6) { // July or later - start of new season
                    return `${String(year).slice(-2)}/${String(year + 1).slice(-2)}`;
                } else { // Before July - still in previous season
                    return `${String(year - 1).slice(-2)}/${String(year).slice(-2)}`;
                }
            };

            // Draw vertical line at the start of the chart
            ctx.strokeStyle = 'rgba(154, 144, 131, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(chartArea.left, chartArea.top);
            ctx.lineTo(chartArea.left, chartArea.bottom);
            ctx.stroke();

            // Add season label at the start
            const firstGameDate = parseDate(games[0].date);
            const startSeason = getSeasonString(firstGameDate);
            ctx.font = '10px Titillium Web';
            ctx.fillStyle = 'rgba(154, 144, 131, 0.5)';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.fillText(`${startSeason} >`, chartArea.left + 5, chartArea.bottom + 5);

            // Draw vertical line at the end of the chart
            ctx.beginPath();
            ctx.moveTo(chartArea.right, chartArea.top);
            ctx.lineTo(chartArea.right, chartArea.bottom);
            ctx.stroke();

            // Add season label at the end
            const lastGameDate = parseDate(games[games.length - 1].date);
            const endSeason = getSeasonString(lastGameDate);
            ctx.textAlign = 'right';
            ctx.fillText(`< ${endSeason}`, chartArea.right - 5, chartArea.bottom + 5);

            // Draw vertical lines for season separators (July 1st)
            games.forEach((game, index) => {
                const gameDate = parseDate(game.date);
                // Check if this is July 1st or later, and previous game was before July 1st
                if (index > 0) {
                    const prevDate = parseDate(games[index - 1].date);
                    const currentYear = gameDate.getFullYear();
                    const prevYear = prevDate.getFullYear();
                    const july1st = new Date(currentYear, 6, 1); // Month 6 = July

                    // If we crossed July 1st between games
                    if ((prevDate < july1st && gameDate >= july1st) ||
                        (prevYear < currentYear && gameDate.getMonth() >= 6)) {
                        // Draw vertical line between bars
                        const barX = xScale.getPixelForValue(index);
                        const prevBarX = xScale.getPixelForValue(index - 1);
                        const separatorX = (barX + prevBarX) / 2;

                        ctx.beginPath();
                        ctx.moveTo(separatorX, chartArea.top);
                        ctx.lineTo(separatorX, chartArea.bottom);
                        ctx.stroke();

                        // Add season labels at the bottom
                        // Determine the season years based on the crossing date
                        let seasonStartYear, seasonEndYear;
                        if (gameDate.getMonth() >= 6) { // July or later
                            seasonStartYear = gameDate.getFullYear();
                            seasonEndYear = gameDate.getFullYear() + 1;
                        } else {
                            seasonStartYear = gameDate.getFullYear() - 1;
                            seasonEndYear = gameDate.getFullYear();
                        }
                        const prevSeasonStart = seasonStartYear - 1;
                        const prevSeasonEnd = seasonStartYear;

                        // Format as 2-digit years
                        const prevSeason = `${String(prevSeasonStart).slice(-2)}/${String(prevSeasonEnd).slice(-2)}`;
                        const newSeason = `${String(seasonStartYear).slice(-2)}/${String(seasonEndYear).slice(-2)}`;

                        ctx.font = '10px Titillium Web';
                        ctx.fillStyle = 'rgba(154, 144, 131, 0.5)';
                        ctx.textBaseline = 'top';

                        // Draw previous season label (left of line) with left arrow
                        ctx.textAlign = 'right';
                        ctx.fillText(`< ${prevSeason}`, separatorX - 5, chartArea.bottom + 5);

                        // Draw new season label (right of line) with right arrow
                        ctx.textAlign = 'left';
                        ctx.fillText(`${newSeason} >`, separatorX + 5, chartArea.bottom + 5);
                    }
                }
            });

            // Get y-position for zero line
            const yPos = yScale.getPixelForValue(0);

            // Set text style for date labels
            ctx.font = 'bold 12px Titillium Web';
            ctx.fillStyle = '#E6B611';
            ctx.textBaseline = 'middle';

            // Draw start date on the left
            const startDate = formatDate(games[0].date);
            ctx.textAlign = 'right';
            ctx.fillText(startDate, chartArea.left - 10, yPos);

            // Draw end date on the right
            const endDate = formatDate(games[games.length - 1].date);
            ctx.textAlign = 'left';
            ctx.fillText(endDate, chartArea.right + 10, yPos);

            ctx.restore();
        }
    };

    // Create chart
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 0,
                maxBarThickness: 50,
                barPercentage: 0.95,
                categoryPercentage: 0.98
            }]
        },
        plugins: [dateLabelPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(1, 0, 1, 0.95)',
                    borderColor: '#E6B611',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold',
                        family: 'Titillium Web'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Titillium Web'
                    },
                    footerFont: {
                        size: 11,
                        family: 'Titillium Web'
                    },
                    titleColor: '#E6B611',
                    bodyColor: '#FFFFFF',
                    footerColor: '#9A9083',
                    displayColors: false,
                    callbacks: {
                        title: (items) => {
                            const game = games[items[0].dataIndex];
                            return `vs ${game.away}`;
                        },
                        label: (item) => {
                            const game = games[item.dataIndex];
                            return `Score: ${game.homeGoals} : ${game.awayGoals}`;
                        },
                        footer: (items) => {
                            const game = games[items[0].dataIndex];
                            return formatDate(game.date);
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    min: -3.5,
                    max: 3.5,
                    grid: {
                        color: 'rgba(154, 144, 131, 0.15)',
                        drawBorder: false,
                        lineWidth: (context) => {
                            return context.tick.value === 0 ? 2 : 1;
                        }
                    },
                    ticks: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                }
            },
            layout: {
                padding: {
                    left: 80,
                    right: 80,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });

    charts[canvasId] = chart;
}

// Apply filters based on current settings
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const minGamesEnabled = document.getElementById('minGamesFilter').checked;

    filteredStints = allStints.filter(stint => {
        const matchesSearch = stint.coach.toLowerCase().includes(searchTerm);
        const matchesMinGames = !minGamesEnabled || stint.games.length >= 10;
        return matchesSearch && matchesMinGames;
    });

    const sortBy = document.getElementById('sortSelect').value;
    sortStints(sortBy);
    renderStints(filteredStints);
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', applyFilters);

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', applyFilters);

    // Min games filter
    const minGamesFilter = document.getElementById('minGamesFilter');
    minGamesFilter.addEventListener('change', applyFilters);

    // Responsive chart resize
    window.addEventListener('resize', debounce(() => {
        Object.values(charts).forEach(chart => chart.resize());
    }, 250));
}

// Sort stints based on selected criteria
function sortStints(sortBy) {
    switch (sortBy) {
        case 'date':
            filteredStints.sort((a, b) => parseDate(a.startDate) - parseDate(b.startDate));
            break;
        case 'coach':
            // Sort by last name (last word in the name)
            filteredStints.sort((a, b) => {
                const lastNameA = a.coach.split(' ').pop();
                const lastNameB = b.coach.split(' ').pop();
                return lastNameA.localeCompare(lastNameB);
            });
            break;
        case 'performance':
            filteredStints.sort((a, b) => b.avgPerformance - a.avgPerformance);
            break;
        case 'games':
            filteredStints.sort((a, b) => b.games.length - a.games.length);
            break;
    }
}

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
