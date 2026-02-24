
import * as d3 from 'd3';

export class ChartBackground {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.options = {
            strokeColor: options.strokeColor || "#FF6B00",
            fillStart: options.fillStart || "rgba(255, 107, 0, 0.2)",
            fillEnd: options.fillEnd || "rgba(255, 107, 0, 0.0)",
            gridColor: options.gridColor || "rgba(255, 255, 255, 0.05)",
            ...options
        };

        this.init();
    }

    init() {
        // Create SVG
        // Dimensions
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        // Debug
        console.log('Chart container dimensions:', this.width, this.height);

        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('display', 'block')
            .style('pointer-events', 'all'); // Allow interaction

        // Generate data (Random Walk)
        this.data = this.generateData(100);

        this.draw();

        window.addEventListener('resize', () => {
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.draw();
        });
    }

    generateData(count) {
        const data = [];
        let value = 50;
        const now = new Date();
        for (let i = 0; i < count; i++) {
            value += (Math.random() - 0.45) * 10; // Slight upward trend
            value = Math.max(0, value);
            data.push({
                date: new Date(now.getTime() + i * 24 * 60 * 60 * 1000),
                value: value
            });
        }
        return data;
    }

    draw() {
        this.svg.selectAll("*").remove(); // Clear

        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const width = this.width - margin.left - margin.right;
        const height = this.height - margin.top - margin.bottom;

        // X Scale
        const x = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.date))
            .range([0, width]);

        // Y Scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.value) * 1.5]) // Extra headroom
            .range([height, 0]);

        // Gradients
        const defs = this.svg.append("defs");

        // Area Gradient
        const areaGradient = defs.append("linearGradient")
            .attr("id", "chart-area-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        areaGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", this.options.strokeColor)
            .attr("stop-opacity", 0.1); // Tenue opacity

        areaGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", this.options.strokeColor)
            .attr("stop-opacity", 0);

        // Grid
        // Vertical
        this.svg.append("g")
            .attr("class", "grid")
            .call(d3.axisBottom(x).ticks(5).tickSize(height).tickFormat(""))
            .selectAll("line")
            .attr("stroke", this.options.gridColor)
            .attr("stroke-dasharray", "3,3");

        // Horizontal
        this.svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""))
            .selectAll("line")
            .attr("stroke", this.options.gridColor)
            .attr("stroke-dasharray", "3,3");

        this.svg.selectAll(".domain").remove(); // Remove axis lines

        // Area
        const area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y(d.value));

        this.svg.append("path")
            .datum(this.data)
            .attr("fill", "url(#chart-area-gradient)")
            .attr("d", area);

        // Line
        const line = d3.line()
            .curve(d3.curveMonotoneX)
            .x(d => x(d.date))
            .y(d => y(d.value));

        this.svg.append("path")
            .datum(this.data)
            .attr("fill", "none")
            .attr("stroke", this.options.strokeColor)
            .attr("stroke-width", 2)
            .attr("opacity", 0.5) // Tenue
            .attr("d", line);

        // Interactions
        const focus = this.svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        // Vertical Line
        focus.append("line")
            .attr("class", "x-hover-line grid-line")
            .attr("y1", 0)
            .attr("y2", height)
            .style("stroke", this.options.strokeColor)
            .style("stroke-width", 1)
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.8);

        // Circle
        focus.append("circle")
            .attr("r", 4)
            .style("fill", this.options.strokeColor)
            .style("stroke", "#fff")
            .style("stroke-width", 2);

        // Overlay for events
        this.svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "transparent")
            .on("mouseover", () => focus.style("display", null))
            .on("mouseout", () => focus.style("display", "none"))
            .on("mousemove", (event) => {
                const bisect = d3.bisector(d => d.date).left;
                const x0 = x.invert(d3.pointer(event)[0]);
                const i = bisect(this.data, x0, 1);
                const d0 = this.data[i - 1];
                const d1 = this.data[i];
                const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.attr("transform", `translate(${x(d.date)},${y(d.value)})`);
                focus.select(".x-hover-line").attr("y2", height - y(d.value));
                focus.select(".x-hover-line").attr("y1", -y(d.value)); // Extend full height
            });
    }
}
