import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'react';
import axios from 'axios';
import 'jquery-ui/ui/widgets/tabs';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pageCount: 0,
      currentPageNo: 0,
      totalRecordCount: 0, 
      loading: true,
      showEarlyPageDots: false,
      showLatePageDots: false,
      showStaticNav: true
    }
  }

  componentDidMount(){
    let self = this;

    this.setState({loading:true});
    var Promise = require("es6-promise");
    Promise.polyfill();
    //let url = 'http://methodeabcom-qa.staging.acml.com/sites/api_service/FundExplorer/SearchResultsByFilter?selectedTab=facts&page=1&clear=false';

    axios.get("page0.json")
    .then((response) => {
      let paging = response.data.SearchResults.Paging;
      self.setState({
        pageCount: paging.PageCount,
        currentPageNo: paging.PageNo + 1, //pages start at 0 in api
        totalRecordCount: paging.TotalRecordCount
      }, this.setState({loading:false}));
      console.log(response.data.SearchResults.Paging);

      if (paging.PageCount < 6) {
        this.setState({showStaticNav: false});
        console.log("less than 6");
      }
    });
  }
  

  displayMiddleSection(){
    let pagesArray = [];
    
    //if total number of pages is equal to or less than 5
    if (this.state.pageCount <= 5){
      for (let i=1; i <= this.state.pageCount; i++){
        pagesArray.push(i);
      }
      console.log(pagesArray);
    }
    else { //total number of pages is more than 5

      //first 3 pages
      if (this.state.currentPageNo < 4) {
        pagesArray = [2,3,4];
      }
      //last 3 pages
      else if (this.state.currentPageNo > this.state.pageCount - 2) {
        pagesArray = [this.state.pageCount-3, this.state.pageCount - 2, this.state.pageCount - 1];
      }
      //3 pages in the middle between dots
      else {
        pagesArray = [this.state.currentPageNo - 1, this.state.currentPageNo, this.state.currentPageNo + 1];
      }
    }
    
    return pagesArray.map((item =>{
      return <li className={this.state.currentPageNo === item ? 'active' : ''} key={item}>
                <a onClick={() => this.changePage(item)}>{item}</a>
            </li>
    }))
  }

  changePage(requestedPage){
    //make api call with requestedPage minus 1
    console.log(requestedPage);
    var self = this;
    this.setState({loading:true});
    var Promise = require("es6-promise");
    Promise.polyfill();

    requestedPage = requestedPage - 1;
    axios.get(`page${requestedPage}.json`)
    .then((response) => {
      let paging = response.data.SearchResults.Paging;
      self.setState({
        pageCount: paging.PageCount,
        currentPageNo: paging.PageNo + 1, //pages start at 0 in api
        totalRecordCount: paging.TotalRecordCount
      }, this.setState({loading:false}));
      console.log(response.data.SearchResults.Paging);

      if (paging.PageCount < 6) {
        this.setState({showStaticNav: false});
        console.log("less than 6");
      }
    });

    //this.setState({currentPageNo: currPage});
  }

  
  render() {
    
      if (this.state.loading === false){
        return (
          <div className="ab-row">
          <div className="abpc-pagination-list">
            <ul className="abpc-pagination">
              <li className={this.state.pageCount > 5 ?  (this.state.currentPageNo === 1 ? "disabled abpc-pagination-first" : "abpc-pagination-first" ) : "disabled abpc-pagination-first"}>
                  <a onClick={() => this.changePage(1)}>First</a>
              </li>
              <li className={this.state.currentPageNo === 1 ? 'disabled abpc-pagination-prev' : 'abpc-pagination-prev'}>
                  <a onClick={()=> this.changePage(this.state.currentPageNo - 1)}>Previous</a>
              </li>
              <li className={this.state.pageCount > 5 ? (this.state.currentPageNo === 1 ? 'active' : '')  : 'disabled'}>
                <a onClick={() => this.changePage(1)}>1</a>
              </li>
              <li className={this.state.pageCount > 5 ? (this.state.currentPageNo < 4 ? "disabled" : "dots") : "disabled"}>
                <a>...</a>
              </li>
              {this.displayMiddleSection()}
              <li className={this.state.pageCount > 5 ? (this.state.currentPageNo <= this.state.pageCount -3 ? "dots" : "disabled") : "disabled"}>
                <a>...</a>
              </li>
              <li className={this.state.pageCount > 5 ? (this.state.currentPageNo === this.state.pageCount ? 'active' : ''): "disabled"}>
                <a onClick={() => this.changePage(this.state.pageCount)}>{this.state.pageCount}</a>
              </li>
              <li className={this.state.currentPageNo === this.state.pageCount ? 'disabled abpc-pagination-next' : 'abpc-pagination-next'}>
                  <a onClick={()=> this.changePage(this.state.currentPageNo + 1)}>Next</a>
              </li>
              <li className={this.state.pageCount > 5 ? (this.state.currentPageNo === this.state.pageCount ? "disabled abpc-pagination-last" : "abpc-pagination-last" ) : "disabled abpc-pagination-last"}>
                  <a onClick={() => this.changePage(this.state.pageCount)}>Last</a>
              </li>
            </ul>
          </div>
        </div>
        );
    }
    else {
      return <div>Loading</div>
    }
  }
}
App.defaultProps = {
  navSource: 'http://methodeabcom.staging.acml.com/sites/api_service/FundExplorer/SearchResultsByFilter?'
};
export default App;
