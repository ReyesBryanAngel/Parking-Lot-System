const staticParkingSlots = [
    { 
        id: 1,
        entryPoint: null,
        name: 'Small Parking', 
        parkingSize: 0, 
        distances: { SP1: 5, SP2: 10, SP3: 25 },
        vehicle: null, 
        fee: null,
        occupied: false,
        charged: false,
        confirmation: false
    },
    {   
        id: 2,     
        entryPoint: null,
        name: 'Medium Parking', 
        parkingSize: 1, 
        distances: { MP1: 4, MP2: 8, MP3: 12 },
        vehicle: null, 
        fee: null,
        occupied: false,
        charged: false,
        confirmation: false
    },
    {   
        id: 3,      
        entryPoint: null,
        name: 'Large Parking', 
        parkingSize: 2, 
        distances: { LP1: 3, LP2: 5, LP3: 7},
        vehicle: null, 
        fee: null,
        occupied: false,
        charged: false,
        confirmation: false
    },        
  ];

  export default staticParkingSlots;