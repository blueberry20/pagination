import React, {
    Component,Children
} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import axios from 'axios';
import _ from 'underscore';
import ReactDOM from 'react-dom';
import Pagination from './Pagination';

class Fundexdata extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			postback:[],
      selectedTab:'',
      tabdata:{},
      paging:{},
      tabname:'',
      currentPage:0,
      TotalRecordCount:0,
      fullyear:new Date().getFullYear(),
      url:'/sites/api_service/FundExplorer/SearchResultsByFilter?',
			loading: true,
      nodata: true,
      segid:['52','22'],
      clear:''
		};
    this.onPevNextPage = this.onPevNextPage.bind(this);
    this.loadNextPrevPage = this.loadNextPrevPage.bind(this);
	}
  onPevNextPage(pageOfItems, pager, page) {
      this.setState({ pageOfItems: pageOfItems });
  }
  loadNextPrevPage(page) {
     this.ajaxcall(this.state.postback,this.state.selectedTab,page,this.state.clear);
  }
  getTabName(selectedTab){
    let tabName = '';
    switch (selectedTab) {
      case 'facts':
        tabName = 'FactItems';
        break;
      case 'pricing':
        tabName = 'DailyPricingItems';
        break;
      case 'calperf':
        tabName = 'CalendarPerformanceItems';
        break;
      case 'annperf':
        tabName = 'AnnualPerformanceItems';
        break;
      case 'rollperf':
        tabName = 'RollingPerformanceItems';
        break;
      default:
    }
    return tabName;
  }
  ajaxcall(postback,selectedTab,currentPage,clear){
    this.setState({
          loading: true,
          nodata: true
    });
		var Promise = require("es6-promise");
		Promise.polyfill();
    let apiCall = this.state.url + 'selectedTab=' + selectedTab + '&page=' + currentPage + '&clear=' + clear;
    axios.post(apiCall,postback)
      .then(response => {
        let tabName = this.getTabName(selectedTab);
        var currentPageVal
        if(response.data.SearchResults.Paging == null){
          currentPageVal = 0;
        }else{
          currentPageVal = response.data.SearchResults.Paging['PageNo'];
        }
        if(typeof(response.data.SearchResults.Tabs[tabName]) != 'undefined' && response.data.SearchResults.Tabs[tabName] !== null){
          if(response.data.SearchResults.Tabs[tabName].length > 0){
            this.setState({
              tabname:tabName,
              tabdata:response.data.SearchResults.Tabs[tabName],
              paging:response.data.SearchResults.Paging,
              totalRecordsNum:response.data.SearchResults.Paging['TotalRecordCount'],
              currentPage:currentPageVal,
              loading:false,
              nodata:false
        	  });
          }else{
            this.setState({
              tabname:tabName,
              loading:false
            });
          }
        }else{
          this.setState({
            tabname:tabName,
            loading:false
          });
        }
      });
	}
  componentDidMount() {
    this.ajaxcall(this.state.postback,this.state.selectedTab,this.state.currentPage,this.state.clear);
	}
  componentWillReceiveProps(nextProps) {
		this.ajaxcall(nextProps.postback,nextProps.selectedTab,0,nextProps.clear);
	}
  checkValue(val){
    let returnVal;
    if(val){
      if(val.toString().indexOf('-') == -1){
        returnVal = true
      }else{
        returnVal = false;
      }
    }
    return returnVal;
  }
  checkAsofDate(val){
    if(typeof(val[0]) != 'undefined'){
      return val[0].AsOfDate;
    }else{
      return false;
    }
  }
  checkAsofDateAUM(val){
    if(typeof(val[0]) != 'undefined'){
      return val[0].NetAssetAsOfDate;
    }else{
      return false;
    }
  }
  createfloatnumdisplay(mynum){
		let newnum = parseFloat(mynum);
		if (isNaN(newnum) || newnum == 0){
			newnum = '-';
		}else{
      newnum = mynum;
    }
		return newnum;
	}
  componentDidUpdate(prevProps, prevState) {
		abpcTranslatePlugin.init();
	}
  render() {
    this.state.postback = this.props.postback;
    this.state.selectedTab = this.props.selectedTab;
    this.state.clear = this.props.clear;
    if (this.state.loading) {
			return <div id="abtl-loader">&nbsp;</div>;
		}
    if (this.state.nodata) {
			  return (
          <div className="ab-container-full abpc-global-translate">
          	<div className="outer-wrapper">
          		<div className="ab-container">
                <div className="ab-row">
                  <div className="abtl-nodata abpc-notes abpc-translate" data-rel="FD_NODATA_SEARCH">We were not able to provide any results that meet your search criteria</div>
                </div>
              </div>
            </div>
          </div>
        )
		}
    return(
      <div className="ab-container-full abpc-global-translate">
      	<div className="outer-wrapper">
      		<div className="ab-container">
  					<div className="ab-row abpc-mc-block abpc-fc-table-cnt">
              <div className={this.state.tabname == 'FactItems' ? 'active':'hide'}>
                  <table className="abpc-fc-table" width="100%">
                    <tr>
                      <th className="abpc-tc-name abpc-translate" data-rel="FE_FUND_NAME">Fund Name</th>
                      <th className="abpc-translate" data-rel="FD_SHARE_CLASS">Share Class</th>
                      <th className="abpc-translate" data-rel="FE_ASSET_CLASS">Asset Class</th>
                      <th className="abpc-translate" data-rel="FD_FUND_INCEPTION_DATE">Fund Inception Date</th>
                      <th><span className="abpc-translate" data-rel="FD_TOTAL_FUND_AUM">Total fund AUM</span> <span className="abpc-translate" data-rel="FD_AS_OF_DATE">as of</span>{' '+this.checkAsofDateAUM(this.state.tabdata)}</th>
                      <th className="abpc-translate" data-rel="FE_SHARE_CLASS_CURRENCY">Share Class Currency</th>
                      <th className="abpc-translate" data-rel="FD_CURRENCY_TYPE">Currency Type</th>
                      {this.state.segid.indexOf(currentSegment) > -1 ? (
                        <th className="abpc-translate" data-rel="FD_WKN">Wkn</th>
                      ):''}
                      {this.state.segid.indexOf(currentSegment) > -1 ? '':(
                        <th className="abpc-translate" data-rel="FD_ISIN">ISIN</th>
                      )}
                      <th className="abpc-translate" data-rel="FE_DOCUMENTS">Documents</th>
                    </tr>
                    {this.state.tabdata.map((item, index) =>
                      <tr>
                        <td className="abpc-tc-name">
                          <a href={item.Url + '?isin=' + item.Isin} className="ab-links-v1">{item.Name}</a>
                        </td>
                        <td>{item.ShareClass}</td>
                        <td className="abpc-translate" data-rel={item.AssetClass}>{item.AssetClass}</td>
                        <td>{item.InceptionDate}</td>
      									<td>{item.TotalFundAum}</td>
                        <td>{item.ShareClassCurrency}</td>
      									<td className="abpc-translate" data-rel={item.CurrencyType}>{item.CurrencyType}</td>
                        {this.state.segid.indexOf(currentSegment) > -1 ? (<td>{item.Wkn}</td>):''}
                        {this.state.segid.indexOf(currentSegment) > -1 ? '':(<td>{item.Isin}</td>)}
                        <td className="abpc-tc-doc abpc-ex">
                          {item.Documents ? (
                            item.Documents.map((doc, docindex) =>
                              <a href={doc.Url} target="_blank" className="ab-links-v1 abpc-translate" data-rel={doc.Title}>{doc.Title}</a>
                            )
                          ):'-'}
                        </td>
                      </tr>
                    )}
                  </table>
              </div>
              <div className={this.state.tabname == 'DailyPricingItems' ? 'active':'hide'}>
                <table className="abpc-fc-table" width="100%">
                  <tr>
                    <th className="abpc-tc-name abpc-translate" data-rel="FE_FUND_NAME">Fund Name</th>
                    <th className="abpc-translate" data-rel="FD_SHARE_CLASS">Share Class</th>
                    <th className="abpc-translate" data-rel="FE_SHARE_CLASS_CURRENCY">Share Class Currency</th>
                    <th className="abpc-translate" data-rel="FD_CURRENCY_TYPE">Currency Type</th>
                    <th className="abpc-translate" data-rel="FD_NAV">NAV</th>
                    <th><span className="abpc-translate" data-rel="FD_NAV">NAV</span> <span className="abpc-translate" data-rel="FD_AS_OF_DATE">As of</span> <span className="abpc-translate" data-rel="FD_DATE">Date</span></th>
                    <th className="abpc-translate" data-rel="FE_CHANGE">Daily Change</th>
                    <th><span className="abpc-translate" data-rel="FE_CHANGE">Daily Change</span>(%)</th>
                    <th className="abpc-translate" data-rel="FE_DISTRIBUTION_YIELD">Distribution Yield</th>
                    <th className="abpc-translate" data-rel="FE_DISTRIBUTION_YIELD_DATE">Distribution Date</th>
                    <th className="abpc-translate" data-rel="FE_FREQUENCY_OF_DIVIDEND_PAYMENTS">Frequency of Dividend Payments</th>
                  </tr>
                  {this.state.tabdata.map((item, index) =>
                    <tr>
                      <td className="abpc-tc-name">
                        <a href={item.Url + '?isin=' + item.Isin} className="ab-links-v1">{item.Name}</a>
                      </td>
                      <td>{item.ShareClass}</td>
                      <td>{item.ShareClassCurrency}</td>
                      <td className="abpc-translate" data-rel={item.CurrencyType}>{item.CurrencyType}</td>
                      <td>{this.createfloatnumdisplay(item.NavValue)}</td>
                      <td>{item.AsOfDate}</td>
                      <td><span className= {this.checkValue(item.NavChangeValue) ? 'abpc-price-up ' : 'abpc-price-down' }>{item.NavChangeValue}</span></td>
                      <td><span className= {this.checkValue(item.NavChangePercentage) ? 'abpc-price-up ' : 'abpc-price-down' }>{item.NavChangePercentage}</span></td>
                      <td>{this.createfloatnumdisplay(item.DistributionYield) != '-' ? this.createfloatnumdisplay(item.DistributionYield) + '%':'-'}</td>
                      <td>{item.DistributionDate ? item.DistributionDate:'-'}</td>
                      <td className="abpc-translate" data-rel={item.FrequencyOfDividendPayments}>{item.FrequencyOfDividendPayments != 'None' ? item.FrequencyOfDividendPayments:'-'}</td>
                    </tr>
                  )}
                </table>
              </div>
              <div className={this.state.tabname == 'CalendarPerformanceItems' ? 'active':'hide'}>
              <table className="abpc-fc-table" width="100%">
                <tr>
                  <th className="abpc-tc-name abpc-translate" data-rel="FE_FUND_NAME">Fund Name</th>
                  <th className="abpc-translate" data-rel="FD_SHARE_CLASS">Share Class</th>
                  <th className="abpc-translate" data-rel="FE_SHARE_CLASS_CURRENCY">Share Class Currency</th>
                  <th className="abpc-translate" data-rel="FD_CURRENCY_TYPE">Currency Type</th>
                  <th>{this.state.fullyear-5}</th>
                  <th>{this.state.fullyear-4}</th>
                  <th>{this.state.fullyear-3}</th>
                  <th>{this.state.fullyear-2}</th>
                  <th>{this.state.fullyear-1}</th>
                  <th><span className="abpc-translate" data-rel="FD_YTD">YTD</span> (<span className="abpc-translate" data-rel="FD_AS_OF_DATE">As of</span>{' ' + this.checkAsofDate(this.state.tabdata)})</th>
                  <th className="abpc-translate" data-rel="FD_FUND_INCEPTION_DATE">Fund Inception Date</th>
                </tr>
                {this.state.tabdata.map((item, index) =>
                  <tr>
                    <td className="abpc-tc-name">
                      <a href={item.Url + '?isin=' + item.Isin} className="ab-links-v1">{item.Name}</a>
                    </td>
                    <td>{item.ShareClass}</td>
                    <td>{item.ShareClassCurrency}</td>
                    <td className="abpc-translate" data-rel={item.CurrencyType}>{item.CurrencyType}</td>
                    <td>{this.createfloatnumdisplay(item.Year5)}</td>
                    <td>{this.createfloatnumdisplay(item.Year4)}</td>
                    <td>{this.createfloatnumdisplay(item.Year3)}</td>
                    <td>{this.createfloatnumdisplay(item.Year2)}</td>
                    <td>{this.createfloatnumdisplay(item.Year1)}</td>
                    <td>{this.createfloatnumdisplay(item.YearToDate)}</td>
                    <td>{item.InceptionDate}</td>
                  </tr>
                )}
              </table>
              </div>
              <div className={this.state.tabname == 'AnnualPerformanceItems' ? 'active':'hide'}>
              <table className="abpc-fc-table" width="100%">
                <tr>
                  <th colSpan="10" className="abpc-td-first"><span className="abpc-translate" data-rel="FD_AS_OF_DATE">As of</span> {this.checkAsofDate(this.state.tabdata)}</th>
                </tr>
                <tr>
                  <th className="abpc-tc-name abpc-translate" data-rel="FE_FUND_NAME">Fund Name</th>
                  <th className="abpc-translate" data-rel="FD_SHARE_CLASS">Share Class</th>
                  <th className="abpc-translate" data-rel="FE_SHARE_CLASS_CURRENCY">Share Class Currency</th>
                  <th className="abpc-translate" data-rel="FD_CURRENCY_TYPE">Currency Type</th>
                  <th className="abpc-translate" data-rel="FD_1_YR">1 YR</th>
                  <th className="abpc-translate" data-rel="FD_3_YR">3 YR</th>
                  <th className="abpc-translate" data-rel="FD_5_YR">5 YR</th>
                  <th className="abpc-translate" data-rel="FD_10_YR">10 YR</th>
                  <th className="abpc-translate" data-rel="FD_SINCE_INCEPTION">Since Inception</th>
                  <th className="abpc-translate" data-rel="FE_INCEPTION_DATE">Inception Date</th>
                </tr>
                {this.state.tabdata.map((item, index) =>
                  <tr>
                    <td className="abpc-tc-name">
                      <a href={item.Url + '?isin=' + item.Isin} className="ab-links-v1">{item.Name}</a>
                    </td>
                    <td>{item.ShareClass}</td>
                    <td>{item.ShareClassCurrency}</td>
                    <td className="abpc-translate" data-rel={item.CurrencyType}>{item.CurrencyType}</td>
                    <td>{this.createfloatnumdisplay(item.Year1)}</td>
                    <td>{this.createfloatnumdisplay(item.Year3)}</td>
                    <td>{this.createfloatnumdisplay(item.Year5)}</td>
                    <td>{this.createfloatnumdisplay(item.Year10)}</td>
                    <td>{this.createfloatnumdisplay(item.SinceInception)}</td>
                    <td>{item.InceptionDate}</td>
                  </tr>
                )}
              </table>
              </div>
              <div className={this.state.tabname == 'RollingPerformanceItems' ? 'active':'hide'}>
                <table className="abpc-fc-table" width="100%">
                  <tr>
                    <th className="abpc-tc-name abpc-translate" data-rel="FE_FUND_NAME">Fund Name</th>
                    <th className="abpc-translate" data-rel="FD_SHARE_CLASS">Share Class</th>
                    <th className="abpc-translate" data-rel="FE_SHARE_CLASS_CURRENCY">Share Class Currency</th>
                    <th className="abpc-translate" data-rel="FD_CURRENCY_TYPE">Currency Type</th>
                  </tr>
                  {this.state.tabdata.map((item, index) =>
                    <tr>
                      <td className="abpc-tc-name">
                        <a href={item.Url + '?isin=' + item.Isin} className="ab-links-v1">{item.Name}</a>
                      </td>
                      <td>{item.ShareClass}</td>
                      <td>{item.ShareClassCurrency}</td>
                      <td>{item.CurrencyType}</td>
                    </tr>
                  )}
                </table>
              </div>
            </div>
            <div className="ab-row two-swipe-to-view hidden-desktop">
              <p className="abpc-translate" data-rel="FD_SWIPE_TXT">Please swipe to view the complete data.</p>
            </div>
            <Pagination items={this.state.tabdata} totalNum={this.state.totalRecordsNum} onPevNextPage={this.onPevNextPage} loadNextPrevPage={this.loadNextPrevPage} currentPage={this.state.currentPage} />
          </div>
        </div>
      </div>
    )
  }
}
export default Fundexdata;
