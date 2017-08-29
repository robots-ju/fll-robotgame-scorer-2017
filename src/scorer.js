/*
 * FLL Robot Game Scorer 2017
 * @author Clark Winkelmann <clark.winkelmann@gmail.com>
 * @license MIT
 */

/* global module */

(function (sc) {

    // Enums inspired by http://stackoverflow.com/a/5040502/3133038
    sc.warnings = Object.freeze({
        m08_max_value_exceeded: 'm08_max_value_exceeded',
        m08_bonus_requirements_not_met: 'm08_bonus_requirements_not_met',
        m09_cannot_score_both: 'm09_cannot_score_both',
        m11_cannot_score_both: 'm11_cannot_score_both',
        m13_bonus_requirements_not_met: 'm13_bonus_requirements_not_met',
        m14_cannot_score_both: 'm14_cannot_score_both',
        m16_bonus_requirements_not_met: 'm16_bonus_requirements_not_met',
        m17_bonus_requirements_not_met: 'm17_bonus_requirements_not_met',
        too_many_penalties: 'too_many_penalties'
    });

    /**
     * Object representing the missions state at the start of the game
     */
    sc.initialMissionsState = {
        m01_broken_pipe_in_base: false,
        m02_big_water_moved: false,
        m03_pump_addition_moved: false,
        m04_rain_came_out: false,
        m05_filter_moved_north: false,
        m06_big_water_ejected: false,
        m07_fountain_layer_raised: false,
        m08_manhole_covers_flipped: 0,
        m08_both_covers_in_separate_targets: false,
        m09_tripod_partly_in_target: false,
        m09_tripod_completely_in_target: false,
        m10_pipe_moved: false,
        m11_pipe_partly_in_target: false,
        m11_pipe_completely_in_target: false,
        m12_sludge_touching_wood: false,
        m13_flower_raised: false,
        m13_rain_in_purple_part: false,
        m14_well_partly_in_target: false,
        m14_well_completely_in_target: false,
        m15_fire_dropped: false,
        m16_rain_in_target: false,
        m16_big_water_in_target: 0,
        m16_big_water_stacked: false,
        m17_slingshot_in_target: false,
        m17_dirty_water_and_rain_in_target: false,
        m18_water_obviously_blue: false,
        penalties: 0
    };

    /**
     * Read and prepare the value of a boolean mission
     * @param {Object} missions
     * @param {string} key
     * @returns {boolean}
     */
    sc.booleanMission = function (missions, key) {
        return missions.hasOwnProperty(key) && missions[key];
    };

    /**
     * Read and prepare the value of a numeric mission
     * @param {Object} missions
     * @param {string} key
     * @returns {number}
     */
    sc.numericMission = function (missions, key) {
        if (missions.hasOwnProperty(key)) {
            return missions[key];
        } else {
            return -1;
        }
    };

    /**
     * Score calculator for the 2017 missions
     * Not intended to be used directly. See `getScore` and `getWarnings` instead
     * @param {Object} missions Associative array of the missions states
     * @returns {Object} Key-value output including `score` and `warnings`
     */
    sc.computeMissions = function (missions) {
        var score = 0;
        var warnings = [];

        /*
         |
         | Mission 01
         |
         */

        if (sc.booleanMission(missions, 'm01_broken_pipe_in_base')) {
            /**
             * 2017.08.29, M01 - PIPE REMOVAL
             * > *Move the Broken Pipe so it is completely in Base.
             * > 20 Points
             */
            score += 20;
        }

        /*
         |
         | Mission 02
         |
         */

        if (sc.booleanMission(missions, 'm02_big_water_moved')) {
            /**
             * 2017.08.29, M02 – FLOW
             * > *Move a Big Water (one time maximum) to the other team’s field *only by turning the Pump System’s valve(s).
             * > 25 Points
             */
            score += 25;
        }

        /*
         |
         | Mission 03
         |
         */

        if (sc.booleanMission(missions, 'm03_pump_addition_moved')) {
            /**
             * 2017.08.29, M03. ANIMAL CONSERVATION
             * > Move the Pump Addition so it has contact with the mat and that contact is completely in the Pump Addition target.
             * > 20 Points
             */
            score += 20;
        }

        /*
         |
         | Mission 04
         |
         */

        if (sc.booleanMission(missions, 'm04_rain_came_out')) {
            /**
             * 2017.08.29, M04 – RAIN
             * > Make at least one Rain come out of the Rain Cloud.
             * > 20 Points
             */
            score += 20;
        }

        /*
         |
         | Mission 05
         |
         */

        if (sc.booleanMission(missions, 'm05_filter_moved_north')) {
            /**
             * 2017.08.29, M05 - FILTER
             * > Move the Filter north until the lock latch drops.
             * > 30 Points
             */
            score += 30;
        }

        /*
         |
         | Mission 06
         |
         */

        if (sc.booleanMission(missions, 'm06_big_water_ejected')) {
            /**
             * 2017.08.29, M06 – WATER TREATMENT
             * > Make the Water Treatment model eject its Big Water, *only by moving the Toilet’s lever.
             * > 20 Points
             */
            score += 20;
        }

        /*
         |
         | Mission 07
         |
         */

        if (sc.booleanMission(missions, 'm07_fountain_layer_raised')) {
            /**
             * 2017.08.29, M07 – FOUNTAIN
             * > Make the Fountain’s middle layer rise some obvious height and stay there, due only to a Big Water in the gray tub.
             * > 20 Points
             */
            score += 20;
        }

        /*
         |
         | Mission 08
         |
         */

        var m08_covers_flipped = sc.numericMission(missions, 'm08_manhole_covers_flipped');

        if (m08_covers_flipped > 0) {
            /**
             * 2017.08.29, M08 – MANHOLE COVERS
             * > Flip Manhole cover(s) over, obviously past vertical *without it/them ever reaching Base.
             * > 15 Points EACH
             */
            score += m08_covers_flipped * 15;

            if (m08_covers_flipped > 2) {
                warnings.push(sc.warnings.m08_max_value_exceeded);
            }
        }

        if (sc.booleanMission(missions, 'm08_both_covers_in_separate_targets')) {
            /**
             * 2017.08.29, M08 – MANHOLE COVERS
             * > FOR BONUS: Score 30 Manhole Cover points as described above WITH both covers completely in separate Tripod targets.
             * > 30 Points Added
             */
            if (m08_covers_flipped === 2) {
                score += 30;
            } else {
                warnings.push(sc.warnings.m08_bonus_requirements_not_met);
            }
        }

        /*
         |
         | Mission 09
         |
         */

        var m09_partly = sc.booleanMission(missions, 'm09_tripod_partly_in_target');
        var m09_completely = sc.booleanMission(missions, 'm09_tripod_completely_in_target');

        if (m09_partly) {
            /**
             * 2017.08.29, M09 – TRIPOD
             * > Move the inspection camera Tripod so it is
             * > FOR PARTIAL SCORE: partly in either Tripod target, with all of its feet touching the mat.
             * > 15 Points
             */
            score += 15;
        }

        if (m09_completely) {
            /**
             * 2017.08.29, M09 – TRIPOD
             * > FOR FULL SCORE: completely in either Tripod target, with all of its feet touching the mat.
             * > 20 Points
             */
            score += 20;
        }

        if (m09_partly && m09_completely) {
            warnings.push(sc.warnings.m09_cannot_score_both);
        }

        /*
         |
         | Mission 10
         |
         */

        if (sc.booleanMission(missions, 'm10_pipe_moved')) {
            /**
             * 2017.08.29, M10 – PIPE REPLACEMENT
             * > (Install the Optional Loop first, in Base, if you wish.) Move a New Pipe so it is where the broken one started, in full/flat contact with the mat.
             * > 20 Points
             */
            score += 20;
        }

        /*
         |
         | Mission 11
         |
         */

        var m11_partly = sc.booleanMission(missions, 'm11_pipe_partly_in_target');
        var m11_completely = sc.booleanMission(missions, 'm11_pipe_completely_in_target');

        if (m11_partly) {
            /**
             * 2017.08.29, M11 – PIPE CONSTRUCTION
             * > (Install the Optional Loop first, in Base, if you wish.) Move a New Pipe so it is
             * > FOR PARTIAL SCORE: partly in its target, in full/flat contact with the mat.
             * > 15 Points
             */
            score += 15;
        }

        if (m11_completely) {
            /**
             * 2017.08.29, M11 – PIPE CONSTRUCTION
             * > (Install the Optional Loop first, in Base, if you wish.) Move a New Pipe so it is
             * > FOR FULL SCORE: completely in its target, in full/flat contact with the mat.
             * > 20 Points
             */
            score += 20;
        }

        if (m11_partly && m11_completely) {
            warnings.push(sc.warnings.m11_cannot_score_both);
        }

        /*
         |
         | Mission 12
         |
         */

        if (sc.booleanMission(missions, 'm12_sludge_touching_wood')) {
            /**
             * 2017.08.29, M12 – SLUDGE
             * > Move the Sludge so it is touching the visible wood of any of the six drawn garden boxes.
             * > 30 Points
             */
            score += 30;
        }

        /*
         |
         | Mission 13
         |
         */

        var m13_flower_raised = sc.booleanMission(missions, 'm13_flower_raised');

        if (m13_flower_raised) {
            /**
             * 2017.08.29, M13 – FLOWER
             * > Make the Flower rise some obvious height and stay there, due only to a Big Water in the brown pot.
             * > 30 Points
             */
            score += 30;
        }

        if (sc.booleanMission(missions, 'm13_rain_in_purple_part')) {
            /**
             * 2017.08.29, M13 – FLOWER
             * > FOR BONUS: Score Flower Points as described above WITH at least one Rain in the purple part, touching nothing but the Flower model.
             * > 30 Points Added
             */
            if (m13_flower_raised >= 1) {
                score += 30;
            } else {
                warnings.push(sc.warnings.m13_bonus_requirements_not_met);
            }
        }

        /*
         |
         | Mission 14
         |
         */

        var m14_partly = sc.booleanMission(missions, 'm14_well_partly_in_target');
        var m14_completely = sc.booleanMission(missions, 'm14_well_completely_in_target');

        if (m14_partly) {
            /**
             * 2017.08.29, M14 – WATER WELL
             * > Move the Water Well so it has contact with the mat and that contact is
             * > FOR PARTIAL SCORE: partly in the Water Well target.
             * > 15 Points
             */
            score += 15;
        }

        if (m14_completely) {
            /**
             * 2017.08.29, M14 – WATER WELL
             * > Move the Water Well so it has contact with the mat and that contact is
             * > FOR FULL SCORE: completely in the Water Well target.
             * > 25 Points
             */
            score += 25;
        }

        if (m14_partly && m14_completely) {
            warnings.push(sc.warnings.m14_cannot_score_both);
        }

        /*
         |
         | Mission 15
         |
         */

        if (sc.booleanMission(missions, 'm15_fire_dropped')) {
            /**
             * 2017.08.29, M15 – FIRE
             * > Make the fire drop *only by making the Firetruck apply direct force to the House’s lever.
             * > 25 Points
             */
            score += 25;
        }

        /*
         |
         | Mission 16
         |
         */

        if (sc.booleanMission(missions, 'm16_rain_in_target')) {
            /**
             * 2017.08.29, M16 – WATER COLLECTION
             * > [...]
             * > At least one Rain
             * > 10 Points
             */
            score += 10;
        }

        var m16_big_water = sc.numericMission(missions, 'm16_big_water_in_target');

        if (m16_big_water > 0) {
            /**
             * 2017.08.29, M16 – WATER COLLECTION
             * > [...]
             * > Big Water
             * > 10 Points EACH
             */
            score += m16_big_water * 10;
        }

        if (sc.booleanMission(missions, 'm16_big_water_stacked')) {
            /**
             * 2017.08.29, M16 – WATER COLLECTION
             * > FOR BONUS: Score at least one Large Water in its target as described above WITH one on top, which is touching nothing but other water
             * > 30 Points
             * > (Maximum only one Bonus can score)
             */
            if (m16_big_water >= 1) {
                score += 30;
            } else {
                warnings.push(sc.warnings.m16_bonus_requirements_not_met);
            }
        }

        /*
         |
         | Mission 17
         |
         */

        var m17_slingshot = sc.booleanMission(missions, 'm17_slingshot_in_target');

        if (m17_slingshot) {
            /**
             * 2017.08.29, M17 – SLINGSHOT
             * > Move the Slingshot so it is completely in its target.
             * > 20 Points
             */
            score += 20;
        }

        if (sc.booleanMission(missions, 'm17_dirty_water_and_rain_in_target')) {
            /**
             * 2017.08.29, M17 – SLINGSHOT
             * > FOR BONUS: Score Slingshot points as described above WITH the Dirty Water and a Rain completely in the Slingshot target.
             * > 15 Points Added
             */
            if (m17_slingshot >= 1) {
                score += 15;
            } else {
                warnings.push(sc.warnings.m17_bonus_requirements_not_met);
            }
        }

        /*
         |
         | Mission 18
         |
         */

        if (sc.booleanMission(missions, 'm18_water_obviously_blue')) {
            /**
             * 2017.08.29, M18 – FAUCET
             * > Make the water level obviously more blue than white as seen from above the cup, *only by turning the Faucet handle.
             * > 25 Points
             */
            score += 25;
        }

        /*
         |
         | Penalties
         |
         */

        if (missions.hasOwnProperty('penalties')) {
            /**
             * 2017.08.29, PENALTIES
             * > You can get up to six such penalties, worth
             * > -5 Points EACH
             */
            score += missions.penalties * -5;

            /**
             * 2017.08.29, PENALTIES
             * > You can get up to six such penalties
             */
            if (missions.penalties > 6) {
                warnings.push(sc.warnings.too_many_penalties);
            }
        }

        return {
            score: score,
            warnings: warnings
        };
    };

    /**
     * @param {Object} missions Associative array of the missions states
     * @returns {Number} Score
     */
    sc.getScore = function (missions) {
        return sc.computeMissions(missions).score;
    };

    /**
     * @param {Object} missions Associative array of the missions states
     * @returns {Array} List of warnings
     */
    sc.getWarnings = function (missions) {
        return sc.computeMissions(missions).warnings;
    };

}(this.FllScorer = this.FllScorer || {}));
if (typeof module === "object") module.exports = this.FllScorer;
