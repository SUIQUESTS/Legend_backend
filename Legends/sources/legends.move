module legends::legends;

use std::string::String;
use sui::clock::Clock;
use sui::url::Url;
use std::vector;
use sui::display;

public struct LEGENDS has drop {}

public struct User has key, store {
    id: UID,
    rewards: address,
    quests: vector<quests_id, points>,
    badges: vector<NFTBadge>,
}

public struct LeaderBoard has store {
    user_id: ID,
    rankings: u64,
    points: u64,
}

public struct NFTBadge has key, store {
    id: UID,
    name: String,
    image_url: url::Url,
    points: u64,
}

public struct Collection has store {
    id: ID,
    badges_id: vector<Badges>,
}

public struct Quests has key {
    quest_id: UID,
    name: String,
    points: u64,
    badges: vector<NFTBadge>, 
}

fun init(otw: LEGENDS, ctx: &mut TxContext) {
    let keys = vector[
        b"name".to_string(),
        b"link".to_string(),
        b"image_url".to_string(),
        b"description".to_string(),
    ];
    let values = vector[
        b"{name}".to_string(),
        b"https://sui-legends.io/hero/{id}".to_string(),
        b"ipfs://{image_url}".to_string(),
        b"A unique legend of the Sui Legends!".to_string(),
    ];

    let publisher = package::claim(otw, ctx);

    let mut display = display::new_with_fields<NFTBadge>(
        &publisher, keys, values, ctx
    );

    display.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
}

public fun mint_badge(recipient: &mut TxContext, name: String, image_url: String, points: u64):NFTBadge {
    NFTBadge {
        id: object::new(recipient),
        name,
        image_url,
        points,
    };
}

public fun award_badge(badge: NFTBadge, recipient: address) {
    transfer::transfer(badge, recipient);
}

public fun upgrade_badge(old_badge: NFTBadge, new_name: string, new_image_url: String, new_points: u64, ctx: &mut TxContext): NFTBadge {
    NFTBadge {
        id: object::new(ctx),
        name: new_name,
        image_url: new_image_url,
        points: new_points,
    }
}

public fun award_badge_if_qualified(user: &User, name: String, image_url: String, points: u64, user_points: u64, required_points: u64, ctx: &mut TxContext) {
    if (user_points >= required_points) {
        let badge = NFTBadge {
            id: object::new(ctx),
            name,
            image_url,
            points,
        };
        mint_badge();
        award_badge();

        vector::push_back(&mut user.badges, badge);
    };
}

public fun complete_quest(user: &mut User, points_earned: u64) {
    user.quests = user.quests.points + points_earned;
}


// public fun attain_leaderboard(user: &User, rankings: , points_earned: u64) {
//     if (user.points ) {

//     }
// }