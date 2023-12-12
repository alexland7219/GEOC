from manim import *

def compEdges(nodes, edges):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=BLACK, max_tip_length_to_length_ratio=0, buff=0.5) for (i, j) in edges]

def compNodes(nodes):
    return [Dot(color=BLACK, radius=0.2, point=x[0]*RIGHT + x[1]*UP) for x in nodes]

class Election(Scene):

    def construct(self):
        self.camera.background_color = "#F9F2E5"
        
       
        intro = Text("II. LEADER ELECTION IN RINGS", color=BLACK, font="DejaVu Sans Mono").scale(0.7)

        self.play(Create(intro))
        self.wait(1)
        self.play(FadeOut(intro))
        self.wait(1)

        caption = Text("POINT DOMINANCE", color=BLACK, font="DejaVu Sans Mono").scale(0.5).move_to(3.5*UP)

        nodes = [Dot(color=RED_E, radius=0.15, point=1.5*LEFT + DOWN), Dot(color=BLUE_E, radius=0.15, point=1.5*RIGHT + UP)]
        tex = [Tex(r"$p$", font_size=120, color=RED_E).scale(0.3).move_to(1.5*LEFT + 1.5*DOWN),
               Tex(r"$q$", font_size=120, color=BLUE_E).scale(0.3).move_to(1.5*RIGHT + 0.5*UP),
               Tex(r"$(p_x, p_y)$", font_size=100, color=RED_E).scale(0.3).move_to(1.5*LEFT + 0.5*DOWN),
               Tex(r"$(q_x, q_y)$", font_size=100, color=BLUE_E).scale(0.3).move_to(1.5*RIGHT + 1.5*UP)]

        plane = NumberPlane(x_range=[-10,10,0.3], y_range=[-10, 10, 0.3], x_length=50, y_length=50, faded_line_style={'stroke_width': 0},
                            x_axis_config=dict(stroke_width=0), y_axis_config=dict(stroke_width=0), background_line_style=dict(stroke_opacity=0.35))

        self.play(Create(caption))
        self.add(plane)
        self.play(*[FadeIn(x) for x in nodes]) 
        self.play(*[Create(x) for x in tex])
        self.wait(1)

        formula = [Tex(r"If $p_y > q_y$, then we say $p \succ q$ ($p$ dominates $q$).", font_size=100, color=BLACK).scale(0.3).move_to(3*DOWN + 2*LEFT),
                   Tex(r"If $p_y = q_y$, then we say $p \succ q$ only if $p_x > q_x$.", font_size=100, color=BLACK).scale(.3).move_to(3.5*DOWN+2.06*LEFT)]

        self.play(Create(formula[0]))
        self.play(Create(formula[1]))

        square = Rectangle(color=BLUE_E, width=15, height=5)
        square.set_fill(BLUE_D, opacity=1)

        inThisCase = Tex(r"$q \succ p$", font_size=100, color=WHITE).scale(0.5).move_to(4*RIGHT+UP)

        square.surround(inThisCase, buff=0.5)


        self.wait(5)
        self.play(Create(square))
        self.play(Create(inThisCase))
        self.wait(5)

        path1 = Line(1.5*RIGHT + UP, 1.5*RIGHT + DOWN)

        moveQ = VGroup(*[tex[1], tex[3], nodes[1]])

        self.play(MoveAlongPath(moveQ, path1))

        self.wait(3)

        path2 = Line(1.5*RIGHT + DOWN, 1.2*RIGHT + 1.8*DOWN)
        square.set_color(RED_E)
        square.set_fill(RED_D, opacity=1)

        otherCas = Tex(r"$p \succ q$", font_size=100, color=WHITE).scale(0.5).move_to(4*RIGHT+UP)
        square.surround(otherCas, buff=0.5)

        self.play(*[MoveAlongPath(moveQ, path2), FadeIn(square), Uncreate(inThisCase), FadeIn(otherCas)])

        self.wait(1)

        moveP = VGroup(*[tex[0], tex[2], nodes[0]])

        path3 = Line(1.5*LEFT + DOWN, 3*LEFT + 2*UP)

        self.play(MoveAlongPath(moveP, path3))

        self.wait(1)

        path4 = Line(3*LEFT + 2*UP, RIGHT+1.2*UP)

        self.play(MoveAlongPath(moveP, path4))

        self.wait(1)

        # Deletion of previous work
        self.play(*[FadeOut(moveP), FadeOut(moveQ)])
        self.play(Uncreate(otherCas))
        self.play(Uncreate(square))
        self.play(*[Uncreate(f) for f in formula])

        self.wait(0.3)

        self.play(Uncreate(caption))

        caption = Text("CONVEX RING: ELECT A LEADER", color=BLACK, font="DejaVu Sans Mono").scale(0.5).move_to(3.5*UP)

        self.play(Create(caption))

        # Creation of elements for the convex ring

        nodes = [(3, 3), (3.7, 1.5), (3.1, -0.5), (0.7, -0.8), (0, 1), (0.65, 2.2)]
        nodes = [(n[0]-1.5, n[1]-1) for n in nodes]
        nodes = [(1.7*x, 1.5*y) for x, y in nodes]
        nodes = [(n[0]+2, n[1]-0.4) for n in nodes]

        nodes = compNodes(nodes)

        edges = [(x, (x+1) % len(nodes)) for x in range(len(nodes))]
        edges = compEdges(nodes, edges)

        self.play(*[Create(x) for x in nodes])
        self.play(*[Create(e) for e in edges])
        self.wait(1)

        text = [Text("A node dominates all others.", color=RED_E, font="DejaVu Sans Mono").scale(0.4).move_to(4*LEFT+2*DOWN)
        ,Text("We want to elect him as leader.", color=RED_E, font="DejaVu Sans Mono").scale(0.4).move_to(4*LEFT+2.5*DOWN)]
        gtext = VGroup(*text).arrange(DOWN, center=False, aligned_edge=LEFT)

        myNode = Dot(color=RED, radius=0.15, point=((3-1.5)*1.7+2)*RIGHT+((3-1)*1.5-0.4)*UP)
        self.play(Create(gtext))
        self.play(Create(myNode))
        self.wait(4)

        # Ask others

        askingNode = Dot(color=GREEN, radius=0.15, point=nodes[-1].get_center())

        text2 = [Text("Every point will ask neighbours.", color=GREEN_E, font="DejaVu Sans Mono").scale(0.4).move_to(3.7*LEFT+2.5*UP)
        , Text("Node will discover if it's the leader.", color=GREEN_E, font="DejaVu Sans Mono").scale(0.4).move_to(3.7*LEFT+2*UP)]
        vText = VGroup(*text2).arrange(DOWN, center=False, aligned_edge=LEFT)

        self.play(Create(askingNode))
        self.play(Create(vText))

        self.wait(1)


        # Create arrows
        arrows = [Arrow(askingNode.get_center(), nodes[0].get_center(), color=BLUE, max_tip_length_to_length_ratio=0.5, buff=0.4),
        Arrow(askingNode.get_center(), nodes[-2].get_center(), color=BLUE, max_tip_length_to_length_ratio=0.5, buff=0.4)]

        # Label for asking node
        tex = [Tex(r"$p$", font_size=120, color=BLACK).scale(0.3).move_to(askingNode.get_center() + 0.5*UP),
               Tex(r"$\alpha$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[-2].get_center() + 0.5*UP),
               Tex(r"$\beta$", font_size=100, color=BLACK).scale(0.3).move_to(nodes[0].get_center() + 0.5*UP)]

        self.play(*[Create(arr) for arr in arrows])
        self.play(*[Create(x) for x in tex])

        self.wait(1)

        # Conclusion

        conc = [Tex(r"$p \succ \alpha , \text{but  } \beta \succ p$", font_size=120, color=BLACK).scale(0.3).move_to(4*LEFT),
               Tex(r"$p \text{  knows he is not the leader}$", font_size=120, color=BLACK).scale(0.3).move_to(4*LEFT + 0.5*DOWN),
        ]

        self.play(Create(conc[0]))
        self.play(Create(conc[1]))
        self.wait(5)

        # Dissolve some things

        self.play(*[Uncreate(x) for x in conc])
        self.play(*[Uncreate(a) for a in arrows])
        self.play(*[Uncreate(t) for t in tex])

        self.play(FadeOut(askingNode))

        self.wait(1.5)

        # Create new things
        askingNode = Dot(color=GREEN, radius=0.15, point=nodes[0].get_center())
        arrows = [Arrow(askingNode.get_center(), nodes[1].get_center(), color=BLUE, max_tip_length_to_length_ratio=0.5, buff=0.4),
        Arrow(askingNode.get_center(), nodes[-1].get_center(), color=BLUE, max_tip_length_to_length_ratio=0.5, buff=0.4)]
        tex = [Tex(r"$p$", font_size=120, color=BLACK).scale(0.3).move_to(askingNode.get_center() + 0.5*UP),
               Tex(r"$\alpha$", font_size=120, color=BLACK).scale(0.3).move_to(nodes[-1].get_center() + 0.5*UP),
               Tex(r"$\beta$", font_size=100, color=BLACK).scale(0.3).move_to(nodes[1].get_center() + 0.5*RIGHT)]

        conc = [Tex(r"$p \succ \alpha \text{  and  } p \succ \beta$", font_size=120, color=BLACK).scale(0.3).move_to(4*LEFT),
               Tex(r"$p \text{  knows he IS the leader}$", font_size=120, color=BLACK).scale(0.3).move_to(4*LEFT + 0.5*DOWN),
        ]

        self.play(*[Create(arr) for arr in arrows])
        self.play(*[Create(x) for x in tex])

        self.wait(1)
        self.play(Create(conc[0]))
        self.play(Create(conc[1]))
        self.wait(5)

        # Message complexity

        self.play(*[Uncreate(t) for t in conc])

        conc = Tex(r"$O(2n) \text{ messages}$", font_size=120, color=BLACK).scale(0.3).move_to(4*LEFT)
        self.play(Create(conc))

        self.wait(10)