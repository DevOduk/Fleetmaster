import { animate, stagger } from "animejs";

const WaterDropGrid = () => {
    return (
        <div className="relative flex-col items-center justify-center p-8">
            <DotGrid />
        </div>
    );
};

const GRID_WIDTH = 25;
const GRID_HEIGHT = 20;

const DotGrid = () => {
    const handleDotClick = (e) => {
        // Find the closest element that has our data-index attribute
        const targetDot = e.target.closest("[data-index]");
        if (!targetDot) return;

        const index = targetDot.dataset.index;

        animate(".dot-point", {
            scale: [
                { value: 1.35, easing: "easeOutSine", duration: 250 },
                { value: 1, easing: "easeInOutQuad", duration: 500 },
            ],
            translateY: [
                { value: -15, easing: "easeOutSine", duration: 250 },
                { value: 0, easing: "easeInOutQuad", duration: 500 },
            ],
            opacity: [
                { value: 1, easing: "easeOutSine", duration: 250 },
                { value: 0.5, easing: "easeInOutQuad", duration: 500 },
            ],
            delay: stagger(100, {
                grid: [GRID_WIDTH, GRID_HEIGHT],
                from: parseInt(index, 10),
            }),
        });
    };

    const dots = [];
    let index = 0;

    for (let i = 0; i < GRID_WIDTH; i++) {
        for (let j = 0; j < GRID_HEIGHT; j++) {
            dots.push(
                <div
                    className="group cursor-crosshair rounded-full p-2 transition-colors"
                    data-index={index} // Moved data-index to the wrapper cell for reliable click detection
                    key={`${i}-${j}`}
                >
                    <div
                        className="dot-point h-2 w-2 rounded-full bg-linear-to-b from-slate-700 to-slate-400 opacity-50 group-hover:from-indigo-600 group-hover:to-white pointer-events-none"
                        data-index={index}
                    />
                </div>
            );
            index++;
        }
    }

    return (
        <div
            onClick={handleDotClick}
            style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)` }}
            className="grid w-max mx-auto"
        >
            {dots}
        </div>
    );
};

export default WaterDropGrid;