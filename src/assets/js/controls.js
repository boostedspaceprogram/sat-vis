export function addSpeedControls(viewer) {
    const speedFactors = [1, 2, 5, 10, 25, 50, 100, 500];
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.bottom = "30px";
    container.style.right = "10px";
    container.style.zIndex = "1000";
    container.style.background = "rgba(255, 255, 255, 0.9)";
    container.style.padding = "10px";
    container.style.borderRadius = "5px";

    // Pause/Play button.
    const pausePlay = document.createElement("button");
    pausePlay.innerHTML = "⏸️";
    pausePlay.onclick = () => {
        viewer.clock.shouldAnimate = !viewer.clock.shouldAnimate;
        pausePlay.innerHTML = viewer.clock.shouldAnimate ? "⏸️" : "▶️";
    };
    container.appendChild(pausePlay);

    // Speed buttons.
    speedFactors.forEach((factor) => {
        const button = document.createElement("button");
        button.innerHTML = `${factor}x`;
        button.onclick = () => {
            viewer.clock.multiplier = factor;
        };
        button.style.marginLeft = "5px";
        container.appendChild(button);
    });

    document.body.appendChild(container);
}
