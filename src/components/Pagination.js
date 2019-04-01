import React, {
    Component,Children
} from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import axios from 'axios';
import _ from 'underscore';
import ReactDOM from 'react-dom';

const propTypes = {
    items:PropTypes.array.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number
}
const defaultProps = {
    initialPage: 1
}
class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          pager: {},
          pagesize:5
        };
    }

    componentWillMount() {
        this.setPage(this.props._page);
      }

    clickEventHandler(page, ele){
      var e = ele.target;
      if( $(e).parent().hasClass('disabled') )
      return false;
      this.setPage(page)
      this.props.loadNextPrevPage(page);
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
    }

    setPage(page) {
        var items = this.props.items;
        var pager = this.state.pager;
        //var pagesize = this.props.pagesize;

        if (page < 0|| page > pager.totalPages-1) {
            return;
        }

        // get new pager object for specified page
        //pager = this.getPager(items.length, page, pagesize);
        pager = this.getPager(this.props.totalNum, this.props.currentPage);

        var pageOfItems = items;
        this.setState({ pager: pager });
        this.props.onPevNextPage(pageOfItems, pager);
    }

    getPager(totalItems, currentPage, pageSize) {
      currentPage = currentPage || 0;
      pageSize = pageSize || 10;
      var totalPages = Math.ceil(totalItems / pageSize);
      var startPage, endPage;
      if (totalPages <= 10) {
          // less than 10 total pages so show all
          startPage = 1;
          endPage = totalPages;
      } else {
          // more than 10 total pages so calculate start and end pages
          if (currentPage <= 6) {
              startPage = 1;
              endPage = 10;
          } else if (currentPage + 4 >= totalPages) {
              startPage = totalPages - 9;
              endPage = totalPages;
          } else {
              startPage = currentPage - 5;
              endPage = currentPage + 4;
          }
      }

      var startIndex = (currentPage - 1) * pageSize;
      var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
      var pages = _.range(startPage, endPage + 1);
      return {
          totalItems: totalItems,
          currentPage: currentPage,
          pageSize: pageSize,
          totalPages: totalPages,
          startPage: startPage,
          endPage: endPage,
          startIndex: startIndex,
          endIndex: endIndex,
          pages: pages
      };
  }

    render() {
        var pager = this.state.pager;
        var items = this.props.items;
        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }

        return (
              <div className="ab-row">
                <div className="abpc-pagination-list">
                  <ul className="abpc-pagination">
                    <li className={pager.currentPage === 0 ? 'disabled abpc-pagination-prev' : 'abpc-pagination-prev'}>
                        <a onClick={(event) => this.clickEventHandler(pager.currentPage - 1, event)}>Previous</a>
                    </li>
                    {pager.pages.map((page, index) =>
                        <li key={index} className={pager.currentPage === page-1 ? 'active' : ''}>
                            <a onClick={(event) => this.clickEventHandler(page-1, event)}>{page}</a>
                        </li>
                    )}
                    <li className={pager.currentPage === pager.totalPages-1 ? 'disabled abpc-pagination-next' : 'abpc-pagination-next'}>
                        <a onClick={(event) => this.clickEventHandler(pager.currentPage + 1, event)}>Next</a>
                    </li>
                  </ul>
                </div>
              </div>
        );
    }
}
Pagination.defaultProps = defaultProps;
export default Pagination;
