module legends::legends;

//use 0x2::table;
use std::string::String;
use std::ascii::string;
use sui::display;
use sui::package;
use sui::clock::{Clock};
use sui::table::{Self, Table};


#[error]
const EIsNotQuestCreator: u64 = 1;
const EQuestCompleted: u64 = 2;
const EQuestIsNotActive: u64 = 3;
const EQuestSubmittedAlready: u64 = 4;
const EQuestSubmissionClosed: u64 = 5;
const EQuestIsClosed: u64 = 6;
#[allow(unused_const)]
const EQuestInProgress: u64= 7;
#[allow(unused_const)]
const EQuestCreated: u64 = 8;

public struct LEGENDS has drop {}

public struct User has key, store {
    id: UID,
    rewards: address,
    quests_points: u64,
}
public struct LeaderBoard has key, store {
    id: UID,
    entries: vector<LeaderBoardEntry>
}
public struct LeaderBoardEntry has store {
    user_id: address,
    points: u64,
}

public struct NFTBadgeRegistry has key, store {
    id: UID,
    badges: Table<ID, NFTBadge>,
    badge_keys: vector<ID>,
}

public struct NFTBadge has key, store {
    id: UID,
    name: String,
    image_url: sui::url::Url,
    points: u64,
    quests_id: u64,
}

public struct Quests has key, store {
    id: UID,
    name: String,
    description: String,
    points: u64,
    status: u64,
    creator: address,
    start_time: u64,
    end_time: u64,
    submission: vector<Submission>,
    winner: Option<address>
}

public struct Submission has store {
    participant: address,
    link: String,
    timestamp: u64,
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
        b"https://media.istockphoto.com{id}".to_string(),
        b"https://media.istockphoto.com/id/2022100465/photo/super-robot-devil.webp?a=1&b=1&s=612x612&w=0&k=20&c=oHhFauOJqViSR7Mj9o1DWVAJlZutfzI6ql65rSOxPQ0=//{image_url}".to_string(),
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

public fun create_quest(name: String, description: String, points: u64, start_time: u64, end_time: u64, ctx: &mut TxContext): Quests {
    Quests {
        id: object::new(ctx),
        name,
        description,
        points,
        status: 0,
        creator: ctx.sender(),
        start_time,
        end_time,
        submission: vector::empty<Submission>(),
        winner: option::none<address>(),
    }
}

public fun add_badge(registry: &mut NFTBadgeRegistry, name: String, image_url: std::ascii::String, points: u64, quests_id: u64, ctx: &mut TxContext) {
    let urls = sui::url::new_unsafe(image_url);
    let badge = NFTBadge {
        id: object::new(ctx),
        name,
        image_url: urls,
        points,
        quests_id,
    };

    let badge_id = sui::object::uid_to_inner(&badge.id);
    table::add(&mut registry.badges, badge_id, badge);
    vector::push_back(&mut registry.badge_keys, badge_id);
}

public fun mint_badge(name: String, image_url: std::ascii::String, points: u64, quests_id: u64, ctx: &mut TxContext):NFTBadge {
    let urls = sui::url::new_unsafe(image_url);
    NFTBadge {
        id: object::new(ctx),
        name,
        image_url: urls,
        points,
        quests_id,
    }
}

public fun award_badge(badge: NFTBadge, recipient: address) {
    transfer::transfer(badge, recipient);
}

public fun upgrade_badge(new_name: String, new_image_url: std::ascii::String, new_points: u64, new_quests_id: u64, ctx: &mut TxContext): NFTBadge {
    let urls = sui::url::new_unsafe(new_image_url);
    NFTBadge {
        id: object::new(ctx),
        name: new_name,
        image_url: urls,
        points: new_points,
        quests_id: new_quests_id,
    }
}

#[allow(lint(public_entry))]
public entry fun select_winner(quest: &mut Quests, winner_address: address, ctx: &mut TxContext) {
    assert!(ctx.sender() == quest.creator, EIsNotQuestCreator);
    assert!(quest.status == EQuestCompleted, EQuestSubmissionClosed);

    quest.winner = option::some(winner_address);
}

public fun award_badge_if_qualified(user: address, name: String, image_url: std::ascii::String, points: u64, user_points: u64, required_points: u64, quests_id: u64, ctx: &mut TxContext) {
    let urls = sui::url::new_unsafe(image_url);
    if (user_points >= required_points) {
        let badge = NFTBadge {
            id: object::new(ctx),
            name,
            image_url: urls,
            points,
            quests_id,
        };
        transfer::transfer(badge, user);
    };
}

#[allow(lint(public_entry))]
public entry fun submit_quests(quest: &mut Quests, link: String, clock: &Clock, ctx: &mut TxContext) {
    let now = sui::clock::timestamp_ms(clock);

    assert!(ctx.sender() != quest.creator, EIsNotQuestCreator);

    assert!(now >= quest.start_time && now < quest.end_time, EQuestIsNotActive);

    let mut user = 0;
    while(user < vector::length(&quest.submission)) {
        let client: &mut Submission = vector::borrow_mut<Submission>(&mut quest.submission, user);
        assert!(client.participant != ctx.sender(), EQuestSubmittedAlready);
        user = user + 1;
    };

    let submission = Submission {
        participant: ctx.sender(),
        link,
        timestamp: now,
    };
    vector::push_back(&mut quest.submission, submission);
}

public fun complete_quest(user: &mut User, quest: &mut Quests, points_earned: u64, leaderboard: &mut LeaderBoard, clock: &Clock) {
    let now = sui::clock::timestamp_ms(clock);
    assert!(now >= quest.end_time, EQuestIsClosed);
    quest.status = EQuestCompleted;
    user.quests_points = user.quests_points + points_earned;
    update_leaderboard(user.rewards, leaderboard, points_earned);
}

public fun get_badge(registry: &NFTBadgeRegistry, id: ID): &NFTBadge {
    table::borrow(&registry.badges, id)
}

public fun get_all_Badges(registry: &NFTBadgeRegistry): vector<NFTBadge> {
    let keys = &registry.badge_keys;
    let mut all_badges = vector::empty<NFTBadge>();
    let len = vector::length(keys);
    let mut entry = 0;
    while (entry < len) {
        let key = *vector::borrow(keys, entry);
        let badge = table::borrow(&registry.badges, key);
        vector::push_back(&mut all_badges, badge);
        entry = entry + 1;
    };
    all_badges
}


public fun update_leaderboard(user: address, leaderboard: &mut LeaderBoard, points: u64) {
    let mut search = false;
    let len = vector::length(&leaderboard.entries);
    let mut units = 0;
    while (units < len) {
        let entry = vector::borrow_mut<LeaderBoardEntry>(&mut leaderboard.entries, units);
        if (entry.user_id == user) {
            entry.points = entry.points + points;
            search = true;
            break;
        };
        units = units + 1;
    };
    if (!search) {
        let new_entry = LeaderBoardEntry { user_id: user, points };
        vector::push_back(&mut leaderboard.entries, new_entry);
    };
}