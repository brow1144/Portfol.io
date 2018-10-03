import React, { Component } from 'react'
import { Row, Col, CardBody, Button, CardTitle } from 'mdbreact'

class Sell extends Component {
  
  render() {
    return (
      <CardBody>
        
        <Row> 
          <Col sm='6'>
            <h6 className='leftText'>Shares</h6>
          </Col>
          <Col sm='6'>
            <input className="form-control form-control-sm" value={this.props.cost} onChange={this.props.updateCost} style={{color: 'whitesmoke', backgroundColor: '#1B1B1D'}} type="number" placeholder="#" />
          </Col>
        </Row>

        <br />

        <Row> 
          <Col sm='8'>
            <h6 className='buySmallText' style={{color: '#009ddb', marginTop: '9px'}}>Market Price</h6>
          </Col>
          <Col sm='4'>
            <p style={{marginTop: '7px', float: 'right', fontSize: '0.8em', color: 'whitesmoke'}}>${this.props.currentPriceFor}</p>
          </Col>
        </Row>
        
        <br />

        <Row> 
          <Col sm='6'>
            <h6 className='leftText' style={{marginTop: '8px'}}>Sell Price</h6>
          </Col>
          <Col sm='6'>
            <p id='finalCost' style={{marginTop: '7px', float: 'right', fontSize: '0.8em', color: 'whitesmoke'}}>${this.props.finalPrice}</p>
          </Col>
        </Row>

        <br />

        <Button color='blue' style={{margin: '0 auto', display: 'block', background: '#009ddb'}}>Submit Order</Button>

        <hr className='hr' />

        <p style={{textAlign: 'center', margin: '0 auto', display: 'block', fontSize: '0.8em', color: 'whitesmoke'}}>$6,000.23 Buying Power Available</p>

      </CardBody>
    )
  }
}

export default Sell