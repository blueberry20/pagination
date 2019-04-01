import 'babel-polyfill';
import React, {
    Component,Children
} from 'react';
import $ from 'jquery';
import axios from 'axios';
import PropTypes from 'prop-types';
import _ from 'underscore';
import ReactDOM from 'react-dom';
import Dropdown from 'react-dropdown';
import Fundexdata from './Fundexdata';

class Fundex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            searchfilter:'',
            selectedTab:'',
            country:'',
            assetclass:[],
            regions:[],
            currency:[],
            currencytype:[],
            shareclass:[],
            shareclasstype:[],
            asset_count:0,
            region_count:0,
            currency_count:0,
            share_count:0,
            selectedTab:'facts',
            tabdata:{},
            paging:{},
            selectedOption:'calperf',
            postback:[],
            clear:false,
            curval:['EUR','USD'],
            countrycode:{}
        };
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }
    setFilter(category,subcategory,bolval,name){
      let crrentAarry = '';
      switch(true) {
        case category == 'ASSETCLASS':
            crrentAarry = 'assetclass';
            break;
        case category == 'REGION':
            crrentAarry = 'regions';
            break;
        case (category == 'CURRENCY' && subcategory == 'CURRENCY'):
            crrentAarry = 'currency';
            break;
        case (category == 'CURRENCY' && subcategory == 'TYPE'):
            crrentAarry = 'currencytype';
            break;
        case (category == 'SHARECLASS' && subcategory == 'CLASS'):
            crrentAarry = 'shareclass';
            break;
        case (category == 'SHARECLASS' && subcategory == 'TYPE'):
            crrentAarry = 'shareclasstype';
            break;
      }
      let newArray = [];
      let currency_type = this.state[crrentAarry].map(function(datavalue){
        if(datavalue.Name == name){
          datavalue.IsSelected = bolval;
        }
        newArray.push(datavalue);
      });
      switch (crrentAarry) {
        case 'assetclass':
          this.setState({
            assetclass:newArray
          });         
          break;
        case 'regions':
          this.setState({
            regions:newArray
          });
          break;
        case 'currency':
          this.setState({
            currency:newArray
          });
          break;
        case 'currencytype':
          this.setState({
            currencytype:newArray
          });
          break;
        case 'shareclass':
          this.setState({
            shareclass:newArray
          });
          break;
        case 'shareclasstype':
          this.setState({
            shareclasstype:newArray
          });          
          break;
        default:
      }
      this.updateLocalstorage();
    }
    updateObject(category,subcategory,checkedtype,value){
      let that = this;
      if(checkedtype){
        that.setFilter(category,subcategory,true,value);
      }else{        
        that.setFilter(category,subcategory,false,value);
      }
      let temarray = that.state.postback;
      let tempcount = 0,temvar;
      switch (category) {
        case 'ASSETCLASS':
            tempcount = that.state.asset_count;
            break;
        case 'REGION':
            tempcount = that.state.region_count;
            break;
        case 'CURRENCY':
            tempcount = that.state.currency_count;
            break;
        case 'SHARECLASS':
            tempcount = that.state.share_count;
            break;
      }
      //console.log(event.target.checked);
      if(checkedtype){
        tempcount = that.updateCounter(tempcount,'plus');
      }else{
        tempcount = that.updateCounter(tempcount,'less');
      }
      if(temarray.length == 0){
        temarray.push(that.createObjec(value,checkedtype,category,subcategory));
      }else{
        let obj = temarray.find(o => o.Name === value);
        if(typeof(obj) === 'undefined'){
          temarray.push(that.createObjec(value,checkedtype,category,subcategory));
        }else{
          temarray.map(function(datavalue){
            if(datavalue.Name == value){
              datavalue.IsSelected = checkedtype;
            }
          });
        }
      }
      that.setState({
        postback:temarray
      });
      that.updateCounterState(category,tempcount);
      abpcFundFilter.init();
      that.renderDataAgain(temarray,that.state.selectedTab,that.state.clear);
    }
    handleChange(category,subcategory,event) {     
      let that = this;
      if(event.type == 'change'){
        if($(event.target).is(':checked')){
          $(event.target).attr("checked", true);
          that.updateObject(category,subcategory,true,event.target.value);
        }else{
          $(event.target).attr("checked", false);
          that.updateObject(category,subcategory,false,event.target.value);
        }
      }else{
        $('.abpc-filter :checkbox[value='+ $(event.target).html() +']').prop("checked",false);        
        that.updateObject(category,subcategory,false,$(event.target).html());
      }
    }
    updateCounterState(cat,count){
      let that = this;
      switch (cat) {
        case 'ASSETCLASS':
            that.setState({
              asset_count:count
            });
            break;
        case 'REGION':
            that.setState({
              region_count:count
            });
            break;
        case 'CURRENCY':
            that.setState({
              currency_count:count
            });
            break;
        case 'SHARECLASS':
            that.setState({
              share_count:count
            });
            break;
        default:
      }
    }
    createObjec(name,bol,cat,subcat){
      let temobj ={'Name':name,'IsSelected':bol,'Category':cat,'SubCategory':subcat}
      return temobj;
    }
    getDatafromQuerystring(key) {
        var qs = (new RegExp('[\\?&]' + key + '=([^&#]*)')).exec(window.location.href);
        if (qs == null) return false;
        else return qs[1];
    }
    componentDidMount() {
        let that = this;
        const searchfilter = that.getDatafromQuerystring('searchfilter');
        const selectedTab = !that.getDatafromQuerystring('selectedTab') ? 'facts':that.getDatafromQuerystring('selectedTab');
        const country = that.getDatafromQuerystring('country');
        const currency = [],curwith = [],curwithout = [],currencytype = [],shareclass = [],shareclasstype = [];
        let currencyfinal = [];
        let currentval = [];
        var asset_count=0,region_count=0,currency_count=0,share_count=0;
        var Promise = require("es6-promise");
        let url;
        if(country && country != ''){
          url = that.props.navSource + 'searchfilter='+ searchfilter + '&selectedTab=' + selectedTab + '&country=' + country + '&clear=' + that.state.clear;
        }else{
          url = that.props.navSource + 'searchfilter='+ searchfilter + '&selectedTab=' + selectedTab + '&clear=' + that.state.clear;
        }
        Promise.polyfill();
        axios.get('/admin/contrycode.json')
        .then(res => {
            const countrycode = res.data.countrycode;
            this.setState({ countrycode });
        });
        axios.post(url).then(response => {
          const tabdata = response.data.SearchResults.Tabs;
          const paging =  response.data.SearchResults.Paging;
          let asset_arry = (that.getLocalstorage(currentSegment+'assetclass')) ? JSON.parse(that.getLocalstorage(currentSegment+'assetclass')):response.data.SearchResults.Filters.AssetClass.Items;
          asset_arry.map(function(datavalue){
            if(datavalue.IsSelected){
              currentval.push(datavalue);
              asset_count = asset_count + 1;
            }
          });
          let region_arry = (that.getLocalstorage(currentSegment+'regions')) ? JSON.parse(that.getLocalstorage(currentSegment+'regions')):response.data.SearchResults.Filters.Region.Items;
          region_arry.map(function(datavalue){
            if(datavalue.IsSelected){
              currentval.push(datavalue);
              region_count = region_count + 1;
            }
          });
          let currency_ar1 = JSON.parse(that.getLocalstorage(currentSegment+'currency'))
          let currency_ar2 = (currency_ar1) ? currency_ar1.concat(JSON.parse(that.getLocalstorage(currentSegment+'currencytype'))):false;
          let currency_arry = (currency_ar2) ? currency_ar2:response.data.SearchResults.Filters.Currency.Items;
          currency_arry.map(function(datavalue){
            if(datavalue.IsSelected){
              currentval.push(datavalue);
              currency_count = currency_count + 1;
            }
            if(datavalue.SubCategory == 'CURRENCY'){
              currency.push(datavalue);
            }else{
              currencytype.push(datavalue);
            }
          });
          let class_ar1 = JSON.parse(that.getLocalstorage(currentSegment+'shareclass'))
          let class_ar2 = (currency_ar1) ? class_ar1.concat(JSON.parse(that.getLocalstorage(currentSegment+'shareclasstype'))):false;
          let class_arry = (class_ar2) ? class_ar2:response.data.SearchResults.Filters.ShareClass.Items;
          class_arry.map(function(datavalue){
            if(datavalue.IsSelected){
              currentval.push(datavalue);
              share_count = share_count + 1;
            }
            if(datavalue.SubCategory == 'CLASS'){
              shareclass.push(datavalue);
            }else{
              shareclasstype.push(datavalue);
            }
          });
          let currencytem_array = currency.map(function(val,index){
            if(that.state.curval.indexOf(val.Name) > -1){
              curwith.push(val);
            }else{
              curwithout.push(val);
            }
          });
          currencyfinal = curwith.concat(curwithout);
          
          that.setState({
              loading: false,
              assetclass:asset_arry,
              regions:region_arry,
              currency:currencyfinal,
              currencytype:currencytype,
              shareclass:shareclass,
              shareclasstype:shareclasstype,
              asset_count:asset_count,
              region_count:region_count,
              currency_count:currency_count,
              share_count:share_count,
              selectedTab:selectedTab,
              tabdata:tabdata,
              paging:paging,
              postback:currentval
          });
          if(that.getLocalstorage(currentSegment+'clear')){
            that.setState({
              clear:true
            });
            that.renderDataAgain(currentval,selectedTab,that.getLocalstorage(currentSegment+'clear'));
            abpcFundFilter.init(); 
          }
          else{
              that.renderDataAgain(currentval,selectedTab,that.state.clear);
          }                                  
        });        
        abpcFundFilter.init(); 
    }
    getLocalstorage(name){
      var cat = '';
      cat = localStorage.getItem(name);
      return cat;
    }
    setLocalstorage(name,arroyofobj){
      localStorage.setItem(name, JSON.stringify(arroyofobj));
    }
    updateLocalstorage(){
      let that = this;
      that.setLocalstorage(currentSegment+'clear',true);
      that.setLocalstorage(currentSegment+'assetclass',that.state.assetclass);
      that.setLocalstorage(currentSegment+'regions',that.state.regions);
      that.setLocalstorage(currentSegment+'currency',that.state.currency);
      that.setLocalstorage(currentSegment+'currencytype',that.state.currencytype);
      that.setLocalstorage(currentSegment+'shareclass',that.state.shareclass);
      that.setLocalstorage(currentSegment+'shareclasstype',that.state.shareclasstype);
    }
    setLocalstoragefilter(name){
      let that = this;
      let arrayofobj = JSON.parse(that.getLocalstorage(name));
      let newArray = [];
      arrayofobj.map(function(datavalue){
        datavalue.IsSelected = false;
        newArray.push(datavalue);
      });
      that.setLocalstorage(name,newArray);
    }
    clearAllstorage(){
      let that = this;
      that.setLocalstoragefilter(currentSegment+'assetclass');
      that.setLocalstoragefilter(currentSegment+'regions');
      that.setLocalstoragefilter(currentSegment+'currency');
      that.setLocalstoragefilter(currentSegment+'currencytype');
      that.setLocalstoragefilter(currentSegment+'shareclass');
      that.setLocalstoragefilter(currentSegment+'shareclasstype');
    }
    componentDidUpdate(prevProps, prevState){
        abpcFundFilter.init();
        //this.renderDataAgain(this.state.postback,this.state.selectedTab);
    }
    updateFilterState(cat){
      let that = this;
      switch (cat) {
        case 'ASSETCLASS':
            that.setState({
              assetclass:that.setFilterFalse('assetclass')
            });
            break;
        case 'REGION':
            that.setState({
              regions:that.setFilterFalse('regions')
            });
            break;
        case 'CURRENCY':
            that.setState({
              currencytype:that.setFilterFalse('currencytype'),
              currency:that.setFilterFalse('currency')
            });
            break;
        case 'SHARECLASS':
            that.setState({
              shareclass:that.setFilterFalse('shareclass'),
              shareclasstype:that.setFilterFalse('shareclasstype')
            });
            break;
        default:
      }
      that.updateLocalstorage();
    }
    removeFilter(type,event){
      let that = this;
      let temarray = that.state.postback;
      let createdArray = [];
      if(temarray.length > 0){
        temarray.map(function(datavalue){
          if(datavalue.Category === type){
            datavalue.IsSelected = false;
          }
          createdArray.push(datavalue);
        });
        that.setState({
          postback:createdArray
        });
      }
      abpcFundFilter.init();
      that.updateCounterState(type,0);
      that.updateFilterState(type);
      that.renderDataAgain(createdArray,that.state.selectedTab,that.state.clear);
    }
    setFilterFalse(type){
      let newArray = [];
      let currency_type = this.state[type].map(function(datavalue){
        datavalue.IsSelected = false;
        newArray.push(datavalue);
      });
      return newArray;
    }
    removeAllFilter(){
      this.setState({
        postback:[],
        asset_count:0,
        region_count:0,
        currency_count:0,
        share_count:0,
        currencytype:this.setFilterFalse('currencytype'),
        currency:this.setFilterFalse('currency'),
        assetclass:this.setFilterFalse('assetclass'),
        regions:this.setFilterFalse('regions'),
        shareclass:this.setFilterFalse('shareclass'),
        shareclasstype:this.setFilterFalse('shareclasstype'),
        clear:true
      });
      abpcFundFilter.init();
      this.renderDataAgain([],this.state.selectedTab,true);
      this.setLocalstorage(currentSegment+'clearall',true);
      this.clearAllstorage();
    }
    updateCounter(countV,type = null){
      //console.log(countV,type);
      let current_count = countV;
      if(type == 'less'){
        current_count = current_count - 1;
      }else if(type == 'plus'){
        current_count = current_count + 1;
      }
      return current_count;
    }
    renderDataAgain(postback,tab,clear){
        ReactDOM.render(<Fundexdata postback={postback} selectedTab={tab} clear={clear} />, document.getElementById('abpc-fund-explorer-data'));
    }
    changeTab(val){
      let currentVal;
      if(val == 'performance'){
        currentVal = this.state.selectedOption;
      }else{
        currentVal = val;
      }
      if (history.pushState) {
    		var to_be_replaced = this.getDatafromQuerystring('selectedTab');
    		var newurl = window.location.href.replace(to_be_replaced, currentVal);
    		window.history.pushState({
    			path: newurl
    		}, '', newurl);
    	}
      this.setState({
        selectedTab:currentVal
      });
      abpcFundFilter.init();
      this.renderDataAgain(this.state.postback,currentVal,this.state.clear);
    }
    handleOptionChange(changeEvent){
      this.setState({
  	    selectedOption:changeEvent.target.value
  	  });
      abpcFundFilter.init();
  		this.renderDataAgain(this.state.postback,changeEvent.target.value,this.state.clear);
  	}
    returnCheckbox(item,cssClass){
      if(item.IsSelected){
        return <input type="checkbox" name={cssClass} className="abpc-checkbox" ref={item.Category,item.SubCategory} checked='checked' onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
      }else{
        return <input type="checkbox" name={cssClass} className="abpc-checkbox" ref={item.Category,item.SubCategory} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
      }
    }
    render() {
      let url = 'https://www.alliancebernstein.com/investments/abii/DoingBusinessProxy.aspx?user=FA&country='+ this.state.countrycode[currentSegment] +'&lang=en&url=/investments/abii/DoingBusinessXLall.aspx?cnid%3D7913%26PrntNavID%3D7813%26xlall%3D1%26nid%3D7913';
      var currencycol = parseInt(this.state.currency.length) / parseInt(3);
      currencycol = Math.round(parseFloat(currencycol));
      var classcol = parseInt(this.state.shareclass.length) / parseInt(2);
      classcol = Math.round(parseFloat(classcol));
      var distrib = 0;
      var shareclassC = this.state.shareclasstype.map(function(datavalue){
        if(datavalue.Name != 'Accumulating'){
          distrib = distrib + 1;
        }
      });
       return (
        <div className="abpc-global-translate">
          <div className="ab-container-full ab-background-lowlight">
      	    <div className="outer-wrapper">
              <div className="ab-container">
                <div className="ab-row abpc-filter">
                  <div className="ab-col-10">
                    <div className="ab-col-6">
                      <div className="ab-col-6">
                        <div className="abpc-filter-box">
                          <header>
                            <span className="abui-em-1p142 klavika-bold text-uppercase abpc-translate" data-rel="FE_ASSET_CLASSES_REGION" >Asset Classes</span>
                            <p className="abui-em-1p142 klavika-regular">
                            {(this.state.asset_count > 0 ? (<div className="abpc-active-filter"><span className="abpc-translate" data-rel="FE_FILTER_APPLIED">Filters applied</span>{' (' + this.state.asset_count + ')'}</div>):<span className="abpc-translate" data-rel="FE_NO_FILTER_APPLIED">No filters applied</span>)}                
                            </p>
                          </header>
                        </div>
                        <div className="abpc-filter-sec">
                          <a href="javascript:;" className="abpc-clear-filter abpc-translate" data-rel="FE_CLEAR_FILTER" ref="ASSETCLASS" onClick={this.removeFilter.bind(this,'ASSETCLASS')}>Clear filters</a>
                          <ul>
                            {this.state.assetclass.map((item, index) =>
                                <li>
                                  <input type="checkbox" id={item.Name + index} name="asset-class" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                  <label className="abpc-translate" htmlFor={item.Name + index} data-rel={item.Name}>{item.Name}</label>
                                </li>
                            )}
                          </ul>
                        </div>
                      </div>
                      <div className="ab-col-6">
                        <div className="abpc-filter-box">
                          <header>
                            <span className="abui-em-1p142 klavika-bold text-uppercase abpc-translate" data-rel="FE_Region">Regions</span>
                            <p className="abui-em-1p142 klavika-regular">
                              {(this.state.region_count > 0 ? (<div className="abpc-active-filter"><span className="abpc-translate" data-rel="FE_FILTER_APPLIED">Filters applied</span>{' (' + this.state.region_count + ')'}</div>):<span className="abpc-translate" data-rel="FE_NO_FILTER_APPLIED">No filters applied</span>)}                                            
                            </p>
                          </header>
                        </div>
                        <div className="abpc-filter-sec">
                          <a href="javascript:;" className="abpc-clear-filter abpc-translate" data-rel="FE_CLEAR_FILTER" ref="REGION" onClick={this.removeFilter.bind(this,'REGION')}>Clear filters</a>
                          <ul>
                            {this.state.regions.map((item, index) =>
                                <li>
                                  <input type="checkbox" id={item.Name + index} name="regions" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                  <label className="abpc-translate" htmlFor={item.Name + index} data-rel={item.Name}>{item.Name}</label>
                                </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="ab-col-6">
                      <div className="ab-col-6">
                        <div className="abpc-filter-box">
                          <header>
                            <span className="abui-em-1p142 klavika-bold text-uppercase abpc-translate" data-rel="FE_CURRENCIES">Currencies</span>
                            <p className="abui-em-1p142 klavika-regular">
                              {(this.state.currency_count > 0 ? (<div className="abpc-active-filter"><span className="abpc-translate" data-rel="FE_FILTER_APPLIED">Filters applied</span>{' (' + this.state.currency_count + ')'}</div>):<span className="abpc-translate" data-rel="FE_NO_FILTER_APPLIED">No filters applied</span>)}
                            </p>
                          </header>
                        </div>
                        <div className="abpc-filter-sec">
                          <a href="javascript:;" className="abpc-clear-filter abpc-translate" data-rel="FE_CLEAR_FILTER" ref="CURRENCY" onClick={this.removeFilter.bind(this,'CURRENCY')}>Clear filter</a>
                          <div className="ab-row">
                            <div className="ab-col-8">
                              <header className="abpc-translate" data-rel="FE_CURRENCY">Currency</header>
                                <div className="ab-col-4">
                                  <ul>
                                    {this.state.currency.map((item, index) =>
                                      (index < currencycol ? (
                                        <li>
                                          <input type="checkbox" id={item.Name + index} name="currency" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                          <label htmlFor={item.Name + index}>{item.Name}</label>
                                        </li>
                                      ):'')
                                    )}
                                  </ul>
                                </div>
                                <div className="ab-col-4">
                                  <ul>
                                    {this.state.currency.map((item, index) =>
                                      (index >= currencycol && index < currencycol*2 ? (
                                        <li>
                                          <input type="checkbox" id={item.Name + index} name="currency" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                          <label htmlFor={item.Name + index}>{item.Name}</label>
                                        </li>
                                      ):'')
                                    )}
                                  </ul>
                                </div>
                                <div className="ab-col-4">
                                  <ul>
                                    {this.state.currency.map((item, index) =>
                                      (index >= currencycol*2 ? (
                                        <li>
                                          <input type="checkbox" id={item.Name + index} name="currency" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                          <label htmlFor={item.Name + index}>{item.Name}</label>
                                        </li>
                                      ):'')
                                    )}
                                  </ul>
                                </div>
                            </div>
                            <div className="ab-col-2">
                              <header className="abpc-translate" data-rel="FE_TYPE">Type</header>
                              <ul>
                                {this.state.currencytype.map((item, index) =>
                                    <li>
                                      <input type="checkbox" id={item.Name + index} name="currency-type" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                      <label className="abpc-translate" htmlFor={item.Name + index} data-rel={item.Name}>{item.Name}</label>
                                    </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ab-col-6">
                        <div className="abpc-filter-box">
                          <header>
                            <span className="abui-em-1p142 klavika-bold text-uppercase abpc-translate" data-rel="FE_SHARE_CLASSES_FILTER">Share Classes</span>
                            <p className="abui-em-1p142 klavika-regular">
                            {(this.state.share_count > 0 ? (<div className="abpc-active-filter"><span className="abpc-translate" data-rel="FE_FILTER_APPLIED">Filters applied</span>{' (' + this.state.share_count + ')'}</div>):<span className="abpc-translate" data-rel="FE_NO_FILTER_APPLIED">No filters applied</span>)}
                            </p>
                          </header>
                        </div>
                        <div className="abpc-filter-sec">
                          <a href="javascript:;" className="abpc-clear-filter abpc-translate" data-rel="FE_CLEAR_FILTER" ref="SHARECLASS" onClick={this.removeFilter.bind(this,'SHARECLASS')}>Clear filter</a>
                          <div className="ab-row">
                            <div className="ab-col-6">
                              <header className="abpc-translate" data-rel="FE_TYPE">Type</header>
                              <ul>
                                {this.state.shareclasstype.map((item, index) =>
                                  (item.Name == 'Accumulating' ?(
                                    <li>
                                      <input type="checkbox" id={item.Name + index} name="sc-type" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                      <label className="abpc-translate" htmlFor={item.Name + index} data-rel={item.Name}>{item.Name}</label>
                                    </li>
                                  ):'')
                                )}
                              </ul>
                              <ul className={distrib == 0 ? 'hide':'show'}>
                                <li>
                                  <div><span className="abpc-translate" data-rel="Distribution">Distribution</span></div>
                                  <ul>
                                    {this.state.shareclasstype.map((item, index) =>
                                      (item.Name != 'Accumulating' ?(
                                        <li>
                                          <input type="checkbox" id={item.Name + index} name="sc-type" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                          <label className="abpc-translate" htmlFor={item.Name + index} data-rel={item.Name}>{item.Name}</label>
                                        </li>
                                      ):'')
                                    )}
                                  </ul>
                                </li>
                              </ul>
                            </div>
                            <div className="ab-col-6">
                              <header className="abpc-translate" data-rel="FE_CLASS">Class</header>
                              <div className="ab-col-6">
                                <ul>
                                  {this.state.shareclass.map((item, index) =>
                                    (index < classcol ? (
                                      <li>
                                        <input type="checkbox" id={item.Name + index} name="sc-class" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                        <label htmlFor={item.Name + index}>{item.Name}</label>
                                      </li>
                                    ):'')
                                  )}
                                </ul>
                              </div>
                              <div className="ab-col-6">
                                <ul>
                                  {this.state.shareclass.map((item, index) =>
                                    (index >= classcol ? (
                                      <li>
                                        <input type="checkbox" id={item.Name + index} name="sc-class" className="abpc-checkbox" ref={item.Category,item.SubCategory} checked={item.IsSelected} onChange={this.handleChange.bind(this,item.Category,item.SubCategory)} value={item.Name} />
                                        <label htmlFor={item.Name + index}>{item.Name}</label>
                                      </li>
                                    ):'')
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ab-col-2">
                    <a href="javascript:;" className="abpc-clear-filter abpc-translate" data-rel="FE_CLEAR_ALL_FILTERS" data-id="all" onClick={this.removeAllFilter.bind(this)}>Clear All filters</a>
                  </div>
                </div>
                <div className="ab-row">
                  <div className="abpc-tabs">
                    <ul>
                      <li>
                        <a href="javascript:;" role="fund-facts" data-rel="FE_FUND_FACTS" ref="facts" onClick={this.changeTab.bind(this,'facts')} className={this.state.selectedTab == 'facts' ? 'active abpc-translate':'abpc-translate'}>Fund Facts</a>
                      </li>
                      <li>
                        <a href="javascript:;" role="performance" data-rel="FE_PERFORMANCE" ref="performance" onClick={this.changeTab.bind(this,'performance')} className={this.state.selectedTab == 'calperf' || this.state.selectedTab == 'annperf' || this.state.selectedTab == 'rollperf' ? 'active abpc-translate':'abpc-translate'}>Performance</a>
                      </li>
                      <li>
                        <a href="javascript:;" role="daily-pricing" data-rel="FE_DAILY_PRICING" ref="pricing" onClick={this.changeTab.bind(this,'pricing')} className={this.state.selectedTab == 'pricing' ? 'active abpc-translate':'abpc-translate'}>Daily Pricing</a>
                      </li>
                    </ul>
                  </div>
                  <div className="abpc-links">
                      <a href={url} target="_blank">
                          <span className="abui-button-fund"> 
                              <span className="abpc-translate" data-rel="FD_FUND_DETAILS_ALL">Fund Details (All)</span>
                              <div className="abui-button-wrapper">    
                                  <div className="abui-button-icon abui-download-icon-white"></div>
                              </div>
                          </span> 
                      </a>
                      <a href="http://literature.alliancebernstein.com/literature/ABLitLnk.aspx?general/funds_nav.txt" target="_blank">
                          <span className="abui-button-fund"> 
                              <span className="abpc-translate" data-rel="FD_DAILY_NAV_REPORT">Daily NAV Report</span>
                              <div className="abui-button-wrapper">    
                                  <div className="abui-button-icon abui-download-icon-white"></div>
                              </div>
                          </span> 
                      </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={this.state.selectedTab == 'calperf' || this.state.selectedTab == 'annperf' || this.state.selectedTab == 'rollperf' ? 'ab-container-full active':'ab-container-full hide'}>
           <div className="outer-wrapper">
             <div className="ab-container">
               <div className="ab-row">
                 <div className="abpc-radio abpc-fc-redio">
                   <input type="radio" name="annualsel" value="calperf"  checked={this.state.selectedOption === 'calperf'} onChange={this.handleOptionChange} />
                   <label className="abpc-translate" data-rel="FD_CALENDAR_">Calendar</label>
                 </div>
                 <div className="abpc-radio abpc-fc-redio">
                   <input type="radio" name="annualsel" value="annperf" checked={this.state.selectedOption === 'annperf'} onChange={this.handleOptionChange} />
                   <label className="abpc-translate" data-rel="FD_ANNUALIZED">Annualized</label>
                 </div>
               </div>
             </div>
           </div>
          </div>
        </div>
       );
    }
}
Fundex.defaultProps = {
    navSource: '/sites/api_service/FundExplorer/SearchResultsByFilter?'
};
export default Fundex;
