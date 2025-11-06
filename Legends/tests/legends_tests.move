#[test_only]
module legends::legends_tests;
// uncomment this line to import the module

use legends::legends;

const ENotImplemented: u64 = 0;

#[test]
fun test_award_badge(badge: NFTBadge) {

    let eric = @0x1;
    let scenario = &mut test_scenario::begin(eric);

    {
        let ctx = test_scenario::ctx(&mut scenario);
    }
    test_scenario::next_tx(&mut scenario, eric);
    {
        legends::award_badge(badge: NFTBadge, recipient: eric);

        test_scenario::return_to_sender(eric);
        
    }
    
}

#[test, expected_failure(abort_code = ::legends::legends_tests::ENotImplemented)]
fun test_legends_fail() {
    abort ENotImplemented
}

