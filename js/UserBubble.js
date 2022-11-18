

class UserBubble {
    constructor(_parentElement) {
        this.parentElement = _parentElement;

        this.initVis();
    }
    initVis(){
        let vis = this;

        vis.margin = {top: 0, right: 200, bottom: 0, left: 200};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;








        // let context = (vis.width; vis.height)

        // function polygon(){
        // .curve(d3.curveCardinalClosed)
        //         .scale(148)
        //         .n(
        //             (3 + ((now / 1500) % 5)) | 0
        //         )
        // }


        // var p = polygon()
        //     .curve(d3.curveCardinalClosed)
        //     .context(context)
        //     .scale(vis.width / 2 - 2);
        //
        // context.translate(vis.width / 2, vis.height / 2);

        // do {
        //     context.beginPath();
        //     p.n(5 + ((Date.now() / 1500) % 3 | 0))();
        //     context.stroke();
        //     yield context.canvas;
        //     context.fillStyle = "rgba(255,255,255,0.1)";
        //     context.fillRect(-vis.width / 2, -vis.height / 2, vis.width, vis.height);
        //     context.rotate(0.01);
        // } while (true);



    }

}