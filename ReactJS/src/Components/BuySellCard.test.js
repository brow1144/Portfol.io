import React from 'react';
import {shallow} from 'enzyme';
import BuySellCard from './BuySellCard';
import Buy from './Buy';
import Main from '../Main'
import axios from 'axios';

axios.get = jest.fn((url) => {
  return {then: then, catch: jest.fn()};
});

axios.delete = jest.fn((url) => {
  return {then: then, catch: jest.fn()};
});

axios.post = jest.fn((url) => {
  return {then: then, catch: jest.fn()};
});

const then = jest.fn(() => {
  return {catch: jest.fn()};
})

const ev = {
  preventDefault: jest.fn(),
  target: {value: '3'}
}

describe('Positive Buy', () => {
  test('Valid Number of Stocks (3)', () => {
    const buySellCard = shallow(<BuySellCard />);
    buySellCard.setProps({currentGame: {start_time: 0}});
    buySellCard.instance().updateCost(ev);
    expect(buySellCard.state().cost).toBe("3");
  })

  test('Click Buy', () => {
    const buySellCard = shallow(<BuySellCard />);
    buySellCard.setProps({currentGame: {start_time: 0}});
    buySellCard.find('#buySwitch').simulate('click');
    expect(buySellCard.state().selected).toBe("buy");
  })
})



describe('Negative Buy', () => {
  test('Valid Number of Stocks (0)', () => {
    ev.target.value = 0;
    const buySellCard = shallow(<BuySellCard />);
    buySellCard.setProps({currentGame: {start_time: 0}});
    buySellCard.instance().updateCost(ev);
    expect(buySellCard.state().cost).toBe(0);
  })

  test('Dont enter a number', () => {
    ev.target.value = 0;
    const buySellCard = shallow(<BuySellCard />);
    buySellCard.setProps({currentGame: {start_time: 0}});
    buySellCard.setProps({currentPrice: 50})
    buySellCard.setState({cost: 0})
    buySellCard.instance().buyStock();
    expect(buySellCard.state().errorMessage).toBe('You entered an invalid number of stocks');
  })
})



describe('Positive Sell', () => {
  test('Valid Number of Stocks (3)', () => {
    ev.target.value = 3;
    const buySellCard = shallow(<BuySellCard />);
    buySellCard.setProps({currentGame: {start_time: 0}});
    buySellCard.instance().updateCost(ev);
    expect(buySellCard.state().cost).toBe(3);
  })
  test('Click Sell', () => {
    const buySellCard = shallow(<BuySellCard />);
    buySellCard.setProps({currentGame: {start_time: 9999999}});
    buySellCard.find('#sellSwitch').simulate('click');
    expect(buySellCard.state().selected).toBe("sell");
  })
})


describe('Negative Sell', () => {
  test('Valid Number of Stocks (0)', () => {
    ev.target.value = 0;
    const buySellCard = shallow(<BuySellCard />);
    buySellCard.setProps({currentGame: {start_time: 0}});
    buySellCard.instance().updateCost(ev);
    expect(buySellCard.state().cost).toBe(0);
  })

  test('Dont enter a number', () => {
    ev.target.value = 0;
    const buySellCard = shallow(<BuySellCard />);
    buySellCard.setProps({currentGame: {start_time: 0}});
    buySellCard.setProps({currentPrice: 50})
    buySellCard.setState({cost: 0})
    buySellCard.instance().buyStock();
    expect(buySellCard.state().errorMessage).toBe('You entered an invalid number of stocks');
  })
})

const currentGame = {
  start_time: "2018-10-05T01:32:53.377Z",
  end_time:"2018-11-02T01:32:53.377Z"
}

describe('Watchlist function', () => {
  test('Watchlist add', () => {
    const buySellCard = shallow(<BuySellCard />);
    buySellCard.setState({watch: false})
    buySellCard.instance().watch();
    expect(buySellCard.state().watch).toBe(true);
  })


  test('Watchlist remove', () => {
    const buySellCard = shallow(<BuySellCard />);
    //buySellCard.setProps({currentGame: currentGame});
    buySellCard.setState({watch: true});
    buySellCard.instance().remove();
    expect(buySellCard.state().watch).toBe(false);
  })
})