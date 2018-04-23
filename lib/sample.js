/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * register a new car by the car Owner
 * @param {org.acme.sample.RegisterCar} Input
 * @transaction
 */
function registerCar(Input) {
  	// get the car asset registry
	return getAssetRegistry('org.acme.sample.Car')
  	.then( function (register) {
      // get the factory
      var factory = getFactory();
	  // create a new car with with the VIN number from the input
      var newcar = factory.newResource('org.acme.sample','Car', Input.VIN)  
      // set the car properties
      newcar.Owner = getCurrentParticipant()
      newcar.CarLegalStatus = 'AWAITING_APROVAL'
      newcar.CarHireStatus = 'AVAILABLE'
      newcar.Name = Input.Name
      return register.add(newcar)
      })
  }

/**
 * aprove a car by the regulator
 * @param {org.acme.sample.AproveCar} Input
 * @transaction
 */
function AproveCar(Input) {
  // Get the car asset registry.
  return getAssetRegistry('org.acme.sample.Car')
  .then(function (vehicleAssetRegistry) {
    // Get the vehicle from the input  
    return vehicleAssetRegistry.get(Input.VIN)
    .then( function(cartoaprove) {
      // change car legal status to be aproved
      cartoaprove.CarLegalStatus = 'APROVED'
      // update the registry to reflect teh changes
      return vehicleAssetRegistry.update(cartoaprove)
      })
    })
  }

/**
 * aprove a car by the regulator
 * @param {org.acme.sample.RevokeCar} Input
 * @transaction
 */
function RevokeCar(Input) {
  // Get the car asset registry.
  return getAssetRegistry('org.acme.sample.Car')
  .then(function (vehicleAssetRegistry) {
    // Get the vehicle from the input  
    return vehicleAssetRegistry.get(Input.VIN)
    .then( function(cartoaprove) {
      // change car legal status to be revoked
      cartoaprove.CarLegalStatus = 'REVOKED'
      // update the registry to reflect teh changes
      return vehicleAssetRegistry.update(cartoaprove)
      })
    })
  }

/**
 * aprove a car by the regulator
 * @param {org.acme.sample.HireCar} Input
 * @transaction
 */
function HireCar(Input) {
  // get the car asset registry
  return getAssetRegistry('org.acme.sample.Car')
  	.then( function (assetRegistry) {
    // get the correct car from the input
    return assetRegistry.get(Input.VIN)
    .then( function (HireCar) {
      // check if the car is available
      if (HireCar.CarHireStatus = 'AVAILABLE') {
        // change the car hire status and assign the hirer
        HireCar.CarHireStatus = 'IN_USE'
        HireCar.Hirer = getCurrentParticipant()
        // update the car asset registry to reflect the changes
        return assetRegistry.update(HireCar)
      }
      // if the car is not available throw error     
      else {
        throw new Error('This car is not available')
      }
    })
  })      
}

/**
 * Return a car
 * @param {org.acme.sample.ReturnCar} Input
 * @transaction
 */
function ReturnCar(Input) {
  // Get the car registry
  return getAssetRegistry('org.acme.sample.Car')
  	.then( function (assetRegistry) {
    // Get the input vehicle from the car registry
    return assetRegistry.get(Input.VIN)
    .then( function (CarToReturn) {
      // check if the one that submits the transaction is also hiring the car
      if (CarToReturn.Hirer = getCurrentParticipant()) {
        // check if the car is still in use (should not be nessacery)
      	if (CarToReturn.CarHireStatus = 'IN_USE') {
        // change the car hire status and remove its hirer info
        CarToReturn.CarHireStatus = 'AVAILABLE'
      	CarToReturn.Hirer = null
        // update the registry to accomodate the changes
      	return assetRegistry.update(CarToReturn)
      	}
        // if the car is not in use
        else {
          throw new Error('This car is already returned')
      	}
      }
      // if the car is not hired by the participant that submits the transaction
      else {
        throw new Error('This car is not hired by you')
      }
    })
  })      
}


/**
 * Return a car
 * @param {org.acme.sample.RateCar} Input
 * @transaction
 */
function RateCar() {
// Get the car registry
  return getAssetRegistry('org.acme.sample.Car')
  	.then( function (assetRegistry) {
    // Get the input vehicle from the car registry
    return assetRegistry.get(Input.VIN)
    .then( function (CarToRate) {
      // check if the one that submits the transaction is also hiring the car
      if (CarToRate.Hirer = getCurrentParticipant()) {
        var R
        switch(Input.Rating) {
        case R1:
        	R=1
        	break;
        case R2:
        	R=2
        	break;
        case R3:
        	R=3
        	break;
        case R4:
        	R=4
        	break;
        case R5:
        	R=5
        	break; 
        }
        var total = CarToRate.RatingAverage * CarToRate.NumberOfRatings
        var newTotal = total + R
        var newAverage = newTotal / CarToRate.NumberOfRatings
        CarToRate.RatingAverage = newAverage
        CarToRate.NumberOfRatings ++
        return assetRegistry.update(CarToRate)
      }
    })
  })
  
}
