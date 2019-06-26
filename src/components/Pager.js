import React, { Component, Fragment } from 'react';
import _ from 'lodash';

const range = (from, to, step = 1) => {
    let i = from;
    const range = [];
  
    while (i <= to) {
      range.push(i);
      i += step;
    }
  
    return range;
  };

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobile: window.innerWidth < 768
    }
  }

  componentDidMount(){
    window.addEventListener("resize", _.debounce(this.resize.bind(this), 500));
    this.resize();
  }

  resize(){
    this.setState({mobile: window.innerWidth < 768}, console.log(this.state.mobile));
  }

  displayDesktopPager(){
    let pagesArray = [];
    let beforeEllipsis = false;
    let afterEllipsis = false;
    let startRange = 1;
    let endRange;

    //if total number of pages is equal to or less than 9 - display all page numbers
    if (this.props.pageCount <= 9){
      pagesArray = range(1, this.props.pageCount);
    }
    else { //total number of pages is more than 9
      //if current page is in the first 5 pages
      if (this.props.currentPageNo < 6) {
        startRange = 2;
        endRange = 7;
        beforeEllipsis = false;
        afterEllipsis = true;
      }
      //if current page is in the last 5 pages
      else if (this.props.currentPageNo >= this.props.pageCount - 4) {
        startRange = this.props.pageCount -6;
        endRange = this.props.pageCount-1;
        beforeEllipsis = true;
        afterEllipsis = false;
      }
      //5 pages in the middle between ellipses
      else {
        startRange = this.props.currentPageNo -2;
        endRange = this.props.currentPageNo +2;
        beforeEllipsis = true;
        afterEllipsis = true;
      }
      //construct pagesArray [1, middle pages, last page]
      pagesArray = _.flatten([1, range(startRange,endRange), this.props.pageCount]);
      //insert ellipsis after page 1
      beforeEllipsis ? pagesArray.splice(1, 0, "ellipsis") : null;
      //insert ellipsis before the last page
      afterEllipsis ? pagesArray.splice(pagesArray.length-1, 0, "ellipsis") : null;
    }
    return pagesArray.map((item, index) =>{
      return (
          item == "ellipsis" 
          ? 
          <li className="ellipsis" key={index}>...</li> 
          : 
          <li className={this.props.currentPageNo === item ? 'active' : ''} key={index}>
            <a onClick={() => this.props.changePage(item -1)}>{item}</a>
          </li>
          )
    })
  }

  displayMobilePager(){
    let pagesArray = [];
    let beforeEllipsis = false;
    let afterEllipsis = false;
    let startRange = 1;
    let endRange;

    //if total number of pages is equal to or less than 5 - display all page numbers
    if (this.props.pageCount <= 5){
      pagesArray = range(1, this.props.pageCount);
    }
    else { //total number of pages is more than 5
      //if current page is in the first 3 pages
      if (this.props.currentPageNo < 4) {
        startRange = 2;
        endRange = 3;
        beforeEllipsis = false;
        afterEllipsis = true;

      }
      //if current page is in the last 3 pages
      else if (this.props.currentPageNo >= this.props.pageCount - 2) {
        startRange = this.props.pageCount -2;
        endRange = this.props.pageCount-1;
        beforeEllipsis = true;
        afterEllipsis = false;
      }
      //1 page in the middle between ellipses
      else {
        startRange = this.props.currentPageNo;
        endRange = this.props.currentPageNo;
        beforeEllipsis = true;
        afterEllipsis = true;
      }
      //construct pagesArray [1, middle pages, last page]
      pagesArray = _.flatten([1, range(startRange,endRange), this.props.pageCount]);
      //insert ellipsis after page 1
      beforeEllipsis ? pagesArray.splice(1, 0, "ellipsis") : null;
      //insert ellipsis before the last page
      afterEllipsis ? pagesArray.splice(pagesArray.length-1, 0, "ellipsis") : null;
    }
    return pagesArray.map((item, index) =>{
      return (
          item == "ellipsis" 
          ? 
          <li className="ellipsis" key={index}>...</li> 
          : 
          <li className={this.props.currentPageNo === item ? 'active' : ''} key={index}>
            <a onClick={() => this.props.changePage(item -1)}>{item}</a>
          </li>
          )
    });
  }

  
  render() {
        return (
          <Fragment>
            <div className="ab-row">
              <div className="abpc-pagination-list">
                <ul className="abpc-pagination">
                  {/* first  */}
                  <li className={this.state.mobile ? "hidden" : (this.props.pageCount > 2 ?  (this.props.currentPageNo === 1 ? "disabled abpc-pagination-first" : "abpc-pagination-first" ) : "hidden abpc-pagination-first")}>
                      <button disabled = {this.props.currentPageNo === 1} onClick={() => this.props.changePage(0)}></button>
                  </li>
                  {/* back - previous */}
                  <li className={this.props.currentPageNo === 1 ? 'disabled abpc-pagination-prev' : 'abpc-pagination-prev'}>
                      <button disabled = {this.props.currentPageNo === 1} onClick={()=> this.props.changePage(this.props.currentPageNo - 2)}>Back</button>
                  </li>

                  {this.state.mobile ? this.displayMobilePager() : this.displayDesktopPager()}

                  {/* next */}
                  <li className={this.props.currentPageNo === this.props.pageCount ? 'disabled abpc-pagination-next' : 'abpc-pagination-next'}>
                      <button disabled={this.props.currentPageNo === this.props.pageCount} onClick={()=> this.props.changePage(this.props.currentPageNo)}>Next</button>
                  </li>
                  {/* last page - forward icon */}
                  <li className={this.state.mobile ? "hidden" : (this.props.pageCount > 2 ? (this.props.currentPageNo === this.props.pageCount ? "disabled abpc-pagination-last" : "abpc-pagination-last" ) : "hidden abpc-pagination-last")}>
                      <button disabled = {this.props.currentPageNo === this.props.pageCount} onClick={() => this.props.changePage(this.props.pageCount -1)}></button>
                  </li>
                </ul>
              </div>
            </div>
          </Fragment>
        );
  }
}

export default App;
