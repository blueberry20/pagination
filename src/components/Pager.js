import React, { Component, Fragment } from 'react';

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
  }

  displayPager(){
    let pagesArray = [];

    //if total number of pages is equal to or less than 9 - display all page numbers
    if (this.props.pageCount <= 9){
    //   for (let i=1; i <= this.props.pageCount; i++){
    //     pagesArray.push(i);
    //   }
      pagesArray = range(1, 9);
      console.log(pagesArray);
    }
    else { //if total number of pages is more than 9
      console.log("current page no " + this.props.currentPageNo);
      //if current page is in the first 5 pages
      if (this.props.currentPageNo < 6) {
        console.log("less than 6");
        //1,2,3,4,5,6,7, "..", this.props.pageCount
        // for (let i=1; i < 8; i++ ){
        //   pagesArray.push(i);
        // }
        pagesArray = range(1,7);
        pagesArray.push('ellipsis');
        pagesArray.push(this.props.pageCount);
      }
      //if current page is in the last 5 pages
      else if (this.props.currentPageNo >= this.props.pageCount - 4) {
        console.log("last 5 pages");
        //1, "..",this.props.pageCount-6, this.props.pageCount-5, this.props.pageCount-4, this.props.pageCount-3, this.props.pageCount - 2, this.props.pageCount - 1, this.props.pageCount];
        pagesArray.push(1);
        pagesArray.push("ellipsis");
        //add 7 last pages
        // for (let i = this.props.pageCount-6; i <= this.props.pageCount; i++ ){
        //   pagesArray.push(i);
        // }
        const lastFivePages = range(this.props.pageCount-6, this.props.pageCount);
        pagesArray = pagesArray.concat(lastFivePages);
      }
      //5 pages in the middle between ellipses
      else {
        console.log("5 pages in the middle");
        // pagesArray = [1, "ellipsis", this.props.currentPageNo - 2, this.props.currentPageNo - 1, this.props.currentPageNo, this.props.currentPageNo + 1, this.props.currentPageNo + 2, "ellipsis", this.props.pageCount];
        pagesArray.push(1);
        pagesArray.push("ellipsis");
        const middlePages = range(this.props.currentPageNo-2, this.props.currentPageNo+2);
        console.log(middlePages);
        pagesArray = pagesArray.concat(middlePages);
        pagesArray.push("ellipsis");
        pagesArray.push(this.props.pageCount);
      }
      console.log(pagesArray);
    
    }
    //construct pages 
    return pagesArray.map((item, index) =>{
      return (
          item == "ellipsis" ? 
          <li className="ellipsis" key={index}>...</li> : 
          <li className={this.props.currentPageNo === item ? 'active' : ''} key={index}>
            <a onClick={() => this.props.changePage(item)}>{item}</a>
          </li>
          )
    })
  }

  
  render() {
        return (
          <Fragment>
            <div className="ab-row fund-wrapper">
              {this.props.fundData.map((item)=>{
                return <div key={item.Isin} className="fund-item">{item.Name}</div>
              })}
            </div>

            <div className="ab-row">
              <div className="abpc-pagination-list">
                <ul className="abpc-pagination">
                  {/* first - back icon */}
                  <li className={this.props.pageCount > 2 ?  (this.props.currentPageNo === 1 ? "disabled abpc-pagination-first" : "abpc-pagination-first" ) : "disabled abpc-pagination-first"}>
                      <a onClick={() => this.props.changePage(1)}></a>
                  </li>
                  {/* back */}
                  <li className={this.props.currentPageNo === 1 ? 'disabled abpc-pagination-prev' : 'abpc-pagination-prev'}>
                      <a onClick={()=> this.props.changePage(this.props.currentPageNo - 1)}>Back</a>
                  </li>

                  {this.displayPager()}

                  {/* next */}
                  <li className={this.props.currentPageNo === this.props.pageCount ? 'disabled abpc-pagination-next' : 'abpc-pagination-next'}>
                      <a onClick={()=> this.props.changePage(this.props.currentPageNo + 1)}>Next</a>
                  </li>
                  {/* last page - forward icon */}
                  <li className={this.props.pageCount > 2 ? (this.props.currentPageNo === this.props.pageCount ? "disabled abpc-pagination-last" : "abpc-pagination-last" ) : "disabled abpc-pagination-last"}>
                      <a onClick={() => this.props.changePage(this.props.pageCount)}></a>
                  </li>
                </ul>
              </div>
            </div>
          </Fragment>
        );
  }
}

export default App;
