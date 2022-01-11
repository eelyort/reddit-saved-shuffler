import * as React from 'react';
import './RectFill.css';

// square/rect fills
//  ratio is width/height
class RectFill extends React.Component{
    constructor(props){
        super(props);

        this.wrapperRef = React.createRef();
        this.state = {
            dimensions: null,
            eventListenerAttached: false,
        };
    }
    render(){
        // ratio is width/height
        const {padding = 0, ratio = 1} = this.props;
        const {dimensions, eventListenerAttached} = this.state;

        let inners = null;

        if(eventListenerAttached && dimensions !== null){
            const {width, height} = dimensions;

            if(width && height){
                const sideLength = Math.min(width/ratio, height);
                const style = {
                    position: 'absolute',
                    width: `${sideLength*ratio - 2*padding}px`,
                    height: `${sideLength - 2*padding}px`,
                    left: `${(width-sideLength*ratio)/2 + padding}px`,
                    top: `${(height-sideLength)/2 + padding}px`,
                };

                inners = (
                    <div style={style} className={this.props.className}>
                        {this.props.children}
                    </div>
                );
            }
            else {
                console.log(`SquareFill error, found width/height to be: [${width}, ${height}]`);
            }
        }

        return (
            <div ref={this.wrapperRef} className={'rect-fill-js-wrapper-style'} >
                {inners}
            </div>
        );
    }
    componentDidMount() {
        window.addEventListener("resize", () => {
            this.setState(() => ({dimensions: this.wrapperRef.current.getBoundingClientRect()}));
        });
        this.setState(() => ({eventListenerAttached: true}));
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.dimensions === null){
            this.setState(() => ({dimensions: this.wrapperRef.current.getBoundingClientRect()}));
        }
    }
    componentWillUnmount() {
        if(this.state.eventListenerAttached){
            // this.wrapperRef.current.removeEventListener("resize", () => {
            //     console.log('resize');
            //     this.setState(() => ({dimensions: this.wrapperRef.current.getBoundingClientRect()}))
            // });
            window.removeEventListener("resize", () => {
                console.log('resize');
                this.setState(() => ({dimensions: this.wrapperRef.current.getBoundingClientRect()}));
            });
        }
    }
}

export default RectFill;